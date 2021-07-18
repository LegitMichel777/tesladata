import './App.css';
import './Table/Table.css';
import React from 'react';
import serverRequestDelete from './services/serverRequestDelete';
import getPrototype from './GetPrototypes';
import ComponentsData from './DataStructs/ComponentsData';
import ModesData from './DataStructs/ModesData';
import FailsData from './DataStructs/FailsData';
import MainTable from './Table/Table';

import TopMenu from './TopMenu/TopMenu';
import httpCall from './services/appAxios';
import DeleteModal from './Modals/DeleteModal/deleteModal';
import AddModal from './Modals/AddModal/addModal';
import { getSingularDisplayName } from './utils';

class App extends React.Component {
    async fetchStructs() {
        const fetchRequests = [httpCall('http://192.168.1.105:5435/components/fetchAll'),
            httpCall('http://192.168.1.105:5435/fail_mode/fetchAll'),
            httpCall('http://192.168.1.105:5435/mapping/fetchAll'),
        ];
        await Promise.all(fetchRequests).then((reqsReturn) => {
            console.log('Got it!');
            const gotComponentsData = reqsReturn[0][0];
            const gotModesData = reqsReturn[1][0];
            const gotFailsData = reqsReturn[2][0];
            this.rawComponentsData = Array(gotComponentsData.length);
            for (let i = 0; i < gotComponentsData.length; i++) {
                const current = gotComponentsData[i];
                console.log(current);
                this.rawComponentsData[i] = new ComponentsData(current.pkid,
                    current.productname,
                    current.manufacturer,
                    current.contact,
                    current.failrate);
            }
            this.rawModesData = Array(gotModesData.length);
            for (let i = 0; i < gotModesData.length; i++) {
                const current = gotModesData[i];
                this.rawModesData[i] = new ModesData(current.pkid,
                    current.failname,
                    current.code,
                    current.description);
            }

            const componentsIdToIndexMap = new Map();
            const modesIdToIndexMap = new Map();
            for (let i = 0; i < this.rawComponentsData.length; i++) {
                componentsIdToIndexMap.set(this.rawComponentsData[i].dbid, i);
            }
            for (let i = 0; i < this.rawModesData.length; i++) {
                modesIdToIndexMap.set(this.rawModesData[i].dbid, i);
            }
            this.rawFailsData = Array(gotFailsData.length);
            for (let i = 0; i < gotFailsData.length; i++) {
                const current = gotFailsData[i];
                const componentId = current.component_pkid;
                const failmodeId = current.failmode_pkid;
                const componentIndex = componentsIdToIndexMap.get(componentId);
                const failmodeIndex = modesIdToIndexMap.get(failmodeId);
                if (componentIndex === undefined || failmodeIndex === undefined) {
                    console.log('Unable to find corresponding');
                    if (componentIndex === undefined && failmodeIndex === undefined) {
                        console.log('Component and Mode');
                    } else {
                        console.log(componentIndex === undefined ? 'Component' : 'Mode');
                    }
                    console.log(`. Fail #${i} in array, object with pkid ${current.pkid}, component id ${current.component_pkid}, mode id ${current.failmode_pkid}.`);
                } else {
                    this.rawFailsData[i] = new FailsData(current.pkid,
                        componentId, this.rawComponentsData[componentIndex].productname,
                        failmodeId, this.rawModesData[failmodeIndex].failname,
                        this.rawModesData[failmodeIndex].code,
                        this.rawModesData[failmodeIndex].description);
                }
            }

            // initialize the three selections array
            this.componentSelections = Array(this.rawComponentsData.length);
            this.modesSelections = Array(this.rawModesData.length);
            this.failuresSelections = Array(this.rawFailsData.length);
            for (let i = 0; i < this.rawComponentsData.length; i++) {
                this.componentSelections[i] = false;
            }
            for (let i = 0; i < this.rawModesData.length; i++) {
                this.modesSelections[i] = false;
            }
            for (let i = 0; i < this.rawFailsData.length; i++) {
                this.failuresSelections[i] = false;
            }
        });
    }

    constructor(props) {
        super(props);
        this.selectionAnchor = -1;
        this.selectionLastAction = '';
        this.componentsSelectedCache = []; // selection cache is in database sorting
        this.modesSelectedCache = [];
        this.failuresSelectedCache = [];
        this.currentSortToDbMapping = [];
        this.currentDbToSortMapping = [];
        this.rawComponentsData = [];
        this.rawModesData = [];
        this.rawFailsData = [];
        this.state = {
            currentSelectedMenuItem: 'failures',
            sortedColumn: {
                components: 'num',
                failures: 'num',
                modes: 'num',
            },
            sortMethodAscending: {
                components: true,
                failures: true,
                modes: true,
            },
            displayData: [],
            deleteModalShown: false,
            deleteModalText: '',
            addModalShown: false,
        };
    }

    componentDidMount() {
        this.fetchStructs().then(() => {
            this.setState({
                displayData: this.recomputeData('failures', 'num', true),
            });
        });
    }

    changeCurrentSelectedMenuItem(val) {
        this.setState({
            currentSelectedMenuItem: val,
            displayData: this.recomputeData(val),
        });
    }

    recomputeData(selectedState = this.state.currentSelectedMenuItem, sortedColumn = this.state.sortedColumn[selectedState], sortMethodAscending = this.state.sortMethodAscending[selectedState]) {
        this.selectionAnchor = -1;
        this.selectionLastAction = '';
        console.log('Recomputing display data');
        let displayData = [];
        let accompanyingSelectionData = [];
        switch (selectedState) {
        case 'components':
            displayData = this.rawComponentsData.slice();
            accompanyingSelectionData = this.componentSelections;
            break;
        case 'failures':
            displayData = this.rawFailsData.slice();
            accompanyingSelectionData = this.failuresSelections;
            break;
        case 'modes':
            displayData = this.rawModesData.slice();
            accompanyingSelectionData = this.modesSelections;
            break;
        default:
            console.log(`Unknown selected state (${selectedState})`);
        }
        for (let i = 0; i < displayData.length; i++) {
            displayData[i].num = i + 1;
            displayData[i].selected = accompanyingSelectionData[i];
        }
        this.currentSortToDbMapping = Array(displayData.length);
        this.currentDbToSortMapping = Array(displayData.length);
        if (displayData.length > 0) {
            if (sortedColumn === 'num') {
                if (!sortMethodAscending) {
                    displayData.reverse();
                }
            } else {
                const elementsDescription = displayData[0].constructor.getIds;
                const elementsType = displayData[0].constructor.types;
                let sortBy = -1;
                for (let i = 0; i < elementsDescription.length; i++) {
                    if (elementsDescription[i] === sortedColumn) {
                        sortBy = i;
                    }
                }
                if (sortBy === -1) {
                    console.log(`Cannot find sort column ID ${sortedColumn}`);
                    return displayData;
                }
                const floatSort = elementsType[sortBy] === 'number';
                displayData.sort((a, b) => {
                    const aData = a.getData();
                    const bData = b.getData();
                    let aComp = aData[sortBy];
                    let bComp = bData[sortBy];
                    if (floatSort) {
                        aComp = parseFloat(aComp);
                        bComp = parseFloat(bComp);
                    }
                    if (sortMethodAscending) {
                        return (aComp > bComp ? 1 : -1);
                    }
                    return (aComp < bComp ? 1 : -1);
                });
            }
            for (let i = 0; i < displayData.length; i++) {
                this.currentSortToDbMapping[i] = displayData[i].num - 1;
            }
            for (let i = 0; i < displayData.length; i++) {
                this.currentDbToSortMapping[this.currentSortToDbMapping[i]] = i;
            }
        }
        return displayData;
    }

    processClick(tableRow, action) {
    // single select -> deselect everything and only select one. set this to the anchor.
    // multi select -> toggle the selection on that one. if it is now selected, set it to the anchor.
    // if it isn't selected. set the anchor to no anchor.
    // range select -> look at the anchor. if there is no anchor, simply treat this as a multi-select (but without setting another anchor)
    // if there is an anchor, use it and LEAVE IT THERE.
    // if the last action was a multi-select, completely erase its selection and do the selection.
    // remember to set the anchor to none every time the table is resorted

        // required data for each state: anchor, lastAction
        // IMPORTANT: Anchor is in terms of current coordinates
        let relSelectionArray;
        let relSelectionCache;
        switch (tableRow.tableType) {
        case 'components':
            relSelectionArray = this.componentSelections;
            relSelectionCache = this.componentsSelectedCache;
            break;
        case 'failures':
            relSelectionArray = this.failuresSelections;
            relSelectionCache = this.failuresSelectedCache;
            break;
        case 'modes':
            relSelectionArray = this.modesSelections;
            relSelectionCache = this.modesSelectedCache;
            break;
        default:
            console.log(`Processing click for unknown table type ${tableRow.tableType}`);
        }
        const selectIndex = tableRow.tableIndex;
        // eslint-disable-next-line react/no-access-state-in-setstate
        const newDisplayData = this.state.displayData.slice();

        if (action === 'single') {
            for (let i = 0; i < relSelectionCache.length; i++) {
                relSelectionArray[relSelectionCache[i]] = false;
            }
            const dbIndex = this.currentSortToDbMapping[selectIndex];
            relSelectionArray[dbIndex] = true;
            for (let i = 0; i < relSelectionCache.length; i++) {
                newDisplayData[this.currentDbToSortMapping[relSelectionCache[i]]].selected = false;
            }
            newDisplayData[selectIndex].selected = true;
            relSelectionCache = [dbIndex];
            this.selectionLastAction = {
                action: 'single',
                params: selectIndex,
            };
            this.selectionAnchor = selectIndex;
        } else if (action === 'multi' || (action === 'range' && this.selectionAnchor === -1)) {
            const dbIndex = this.currentSortToDbMapping[selectIndex];
            if (relSelectionArray[dbIndex]) {
                // remove the selection and set anchor to none
                relSelectionArray[dbIndex] = false;
                newDisplayData[selectIndex].selected = false;
                for (let i = 0; i < relSelectionCache.length; i++) {
                    if (relSelectionCache[i] === dbIndex) {
                        relSelectionCache.splice(i, 1);
                    }
                }
                this.selectionAnchor = -1;
            } else {
                // add the selection and set anchor to the selection
                relSelectionArray[dbIndex] = true;
                newDisplayData[selectIndex].selected = true;
                relSelectionCache.push(dbIndex);
                if (action !== 'range') {
                    this.selectionAnchor = selectIndex;
                }
            }
            if (action === 'range') {
                this.selectionLastAction = {
                    action: 'range_multi_fallback',
                    params: selectIndex,
                };
            } else {
                this.selectionLastAction = {
                    action: 'multi',
                    params: selectIndex,
                };
            }
        } else if (action === 'range') {
            if (this.selectionLastAction.action === 'range') {
                const eraseL = Math.min(this.selectionAnchor, this.selectionLastAction.params);
                const eraseR = Math.max(this.selectionAnchor, this.selectionLastAction.params);
                for (let i = eraseL; i <= eraseR; i++) {
                    relSelectionArray[this.currentSortToDbMapping[i]] = false;
                    newDisplayData[i].selected = false;
                }
                for (let i = 0; i < relSelectionCache.length; i++) {
                    if (this.currentDbToSortMapping[relSelectionCache[i]] >= eraseL
                        && this.currentDbToSortMapping[relSelectionCache[i]] <= eraseR) {
                        relSelectionCache.splice(i, 1);
                        i--;
                    }
                }
                console.log('Trying to erase ');
                console.log(eraseL);
                console.log(eraseR);
            }
            const l = Math.min(selectIndex, this.selectionAnchor);
            const r = Math.max(selectIndex, this.selectionAnchor);
            for (let i = l; i <= r; i++) {
                if (!relSelectionArray[this.currentSortToDbMapping[i]]) {
                    relSelectionCache.push(this.currentSortToDbMapping[i]);
                }
                relSelectionArray[this.currentSortToDbMapping[i]] = true;
                newDisplayData[i].selected = true;
            }
            console.log('range selecting');
            console.log(l);
            console.log(r);
            this.selectionLastAction = {
                action: 'range',
                params: selectIndex,
            };
        }
        switch (tableRow.tableType) {
        case 'components':
            this.componentSelections = relSelectionArray;
            this.componentsSelectedCache = relSelectionCache;
            break;
        case 'failures':
            this.failuresSelections = relSelectionArray;
            this.failuresSelectedCache = relSelectionCache;
            break;
        case 'modes':
            this.modesSelections = relSelectionArray;
            this.modesSelectedCache = relSelectionCache;
            break;
        default:
            console.log(`Processing click for unknown table type ${tableRow.tableType}`);
        }
        this.setState({
            displayData: newDisplayData,
        });
    }

    getSelectedDetails() {
    // gets details about the current selection for deletion.
    // selectionCache: a list of indexes are selected in the current selected page
    // rawData: just the raw list of data of the current selected page
    // selectionRawData: an array of booleans that provides the source of truth for whether or not every element is selected on the page.
    // relatedFailureDeletions: the indexes of the dependencies in Failures that would be deleted
        const currentState = this.state.currentSelectedMenuItem;
        let selectionCache; let rawData; let selectionRawData;
        const relatedFailureDeletions = [];
        switch (currentState) {
        case 'components':
            selectionCache = this.componentsSelectedCache;
            rawData = this.rawComponentsData;
            selectionRawData = this.componentSelections;
            break;
        case 'failures':
            selectionCache = this.failuresSelectedCache;
            rawData = this.rawFailsData;
            selectionRawData = this.failuresSelections;
            break;
        case 'modes':
            selectionCache = this.modesSelectedCache;
            rawData = this.rawModesData;
            selectionRawData = this.modesSelections;
            break;
        default:
            console.log(`Delete selection called on invalid menu item ${this.state.currentSelectedMenuItem}`);
        }
        if (currentState !== 'failures') {
            const dbidGettingDeletedMap = {};
            for (let i = 0; i < selectionCache.length; i++) {
                dbidGettingDeletedMap[rawData[selectionCache[i]].dbid] = true;
            }
            for (let i = 0; i < this.rawFailsData.length; i++) {
                if (currentState === 'components') {
                    if (dbidGettingDeletedMap[this.rawFailsData[i].failComponentId] === true) {
                        relatedFailureDeletions.push(i);
                    }
                } else if (dbidGettingDeletedMap[this.rawFailsData[i].failModeId] === true) {
                    relatedFailureDeletions.push(i);
                }
            }
        }
        return [selectionCache, rawData, selectionRawData, relatedFailureDeletions];
    }

    async deleteSelection() {
    // delete the current selection, taking into consideration that dependencies (such as failures) also have to be deleted.
        const deleteSelection = [];
        const selectionDetails = this.getSelectedDetails();
        const selectionCache = selectionDetails[0]; const rawData = selectionDetails[1]; const selectionRawData = selectionDetails[2]; const
            relatedFailureDeletions = selectionDetails[3];
        if (selectionCache.length > 0) {
            for (let i = 0; i < selectionCache.length; i++) {
                deleteSelection.push(rawData[selectionCache[i]].dbid);
            }
            // send list of deletions to server and wait for server response
            await serverRequestDelete(deleteSelection, this.state.currentSelectedMenuItem);
            // delete the elements from the local copy according to the cache, which holds a list of items which are selected.
            selectionCache.sort();
            for (let i = selectionCache.length - 1; i >= 0; i--) {
                rawData.splice(selectionCache[i], 1);
                selectionRawData.splice(selectionCache[i], 1);
            }
            // clear the cache
            selectionCache.length = 0;
            if (relatedFailureDeletions.length > 0) {
                // erase related deletions
                relatedFailureDeletions.sort();
                // remove all the related deletions from failures
                // again, go through the list of things that have to be deleted and delete them.
                for (let i = relatedFailureDeletions.length - 1; i >= 0; i--) {
                    this.rawFailsData.splice(relatedFailureDeletions[i], 1);
                    this.failuresSelections.splice(relatedFailureDeletions[i], 1);
                }
                // now remove these things from the cache.
                this.failuresSelectedCache.sort();
                let currentRelatedFailureDeletionsAt = relatedFailureDeletions.length - 1;
                for (let i = this.failuresSelectedCache.length - 1; i >= 0; i--) {
                    if (currentRelatedFailureDeletionsAt !== -1) {
                        if (this.failuresSelectedCache[i] === relatedFailureDeletions[currentRelatedFailureDeletionsAt]) {
                            this.rawFailsData.splice(i, 1);
                            this.failuresSelections.splice(i, 1);
                            currentRelatedFailureDeletionsAt--;
                        }
                    }
                }
            }
            this.setState({
                displayData: this.recomputeData(),
            });
        }
    }

    confirmAndDelete() {
    // generate a confirmation message and show the modal
        let nextConfirmMessage;
        const selectionDetails = this.getSelectedDetails();
        const selectionCache = selectionDetails[0]; const
            willDelete = selectionDetails[3].length;
        if (selectionCache.length === 0) {
            return;
        }
        const currentState = this.state.currentSelectedMenuItem;
        if (currentState === 'failures') {
            nextConfirmMessage = `${selectionCache.length} ${getSingularDisplayName('failures')}${selectionCache.length > 1 ? 's' : ''} will be deleted permanently`;
            this.setState({
                deleteModalShown: true,
                deleteModalText: nextConfirmMessage,
            });
        } else {
            nextConfirmMessage = `${selectionCache.length} ${getSingularDisplayName(currentState === 'components' ? 'components' : 'modes')}${selectionCache.length > 1 ? 's' : ''}`;
            if (willDelete > 0) nextConfirmMessage += ` and ${willDelete} related ${getSingularDisplayName('failures')}${willDelete > 1 ? 's' : ''}`;
            nextConfirmMessage += ' will be deleted permanently';
            this.setState({
                deleteModalShown: true,
                deleteModalText: nextConfirmMessage,
            });
        }
    }

    getCurrentNumberOfSelections() {
    // get the number of items currently selected
        switch (this.state.currentSelectedMenuItem) {
        case 'components':
            return this.componentsSelectedCache.length;
        case 'failures':
            return this.failuresSelectedCache.length;
        case 'modes':
            return this.modesSelectedCache.length;
        default:
            console.log(`Getting current nuumber ot selections called on invalid menu item ${this.state.currentSelectedMenuItem}`);
        }
        return undefined;
    }

    checkDeleteEnabled() {
    // determines whether or not the delete button is greyed out.
        return this.getCurrentNumberOfSelections() > 0;
    }

    checkEditEnabled() {
    // determines whether or not the edit button is greyed out
        return this.getCurrentNumberOfSelections() === 1;
    }

    render() {
        return (
            <div id="masterContainer" className={window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : ''}>
                <DeleteModal
                    show={this.state.deleteModalShown}
                    text={this.state.deleteModalText}
                    deleteClicked={() => {
                        this.deleteSelection();
                        this.setState({
                            deleteModalShown: false,
                        });
                    }}
                    cancelClicked={() => {
                        this.setState({
                            deleteModalShown: false,
                        });
                    }}
                />
                <AddModal
                    show={this.state.addModalShown}
                    addClicked={(args) => {
                        const curPrototype = getPrototype(this.state.currentSelectedMenuItem).constructor;
                        if (args.length === curPrototype.describe.length) {
                            console.log('Adding', args);
                        }
                        this.setState({
                            addModalShown: false,
                        });
                    }}
                    cancelClicked={() => {
                        this.setState({
                            addModalShown: false,
                        });
                    }}
                    addItemDisplayTitle={getSingularDisplayName(this.state.currentSelectedMenuItem)}
                    objectPrototype={getPrototype(this.state.currentSelectedMenuItem)}
                />
                <div id="masterInnerContainer">
                    <div id="topMenuContainer">
                        <TopMenu
                            currentSelectedMenuItem={this.state.currentSelectedMenuItem}
                            setSelectedMenuItem={this.changeCurrentSelectedMenuItem.bind(this)}
                            deleteEnabled={this.checkDeleteEnabled()}
                            editEnabled={this.checkEditEnabled()}
                            performDelete={this.confirmAndDelete.bind(this)}
                            performAdd={() => {
                                this.setState({
                                    addModalShown: true,
                                });
                            }}
                        />
                    </div>
                    <MainTable
                        displayData={this.state.displayData}
                        sortedColumn={this.state.sortedColumn[this.state.currentSelectedMenuItem]}
                        sortMethodAscending={this.state.sortMethodAscending[this.state.currentSelectedMenuItem]}
                        tableType={this.state.currentSelectedMenuItem}
                        processClick={this.processClick.bind(this)}
                        highlightData={this.state.highlightData}
                        tableDataPrototype={getPrototype(this.state.currentSelectedMenuItem)}
                        setSortMethod={(method, ascending) => {
                            this.setState((previousState) => ({
                                sortedColumn: {
                                    components: (previousState.currentSelectedMenuItem === 'components' ? method : previousState.sortedColumn.components),
                                    failures: (previousState.currentSelectedMenuItem === 'failures' ? method : previousState.sortedColumn.failures),
                                    modes: (previousState.currentSelectedMenuItem === 'modes' ? method : previousState.sortedColumn.modes),
                                },
                                sortMethodAscending: {
                                    components: (previousState.currentSelectedMenuItem === 'components' ? ascending : previousState.sortedColumn.components),
                                    failures: (previousState.currentSelectedMenuItem === 'failures' ? ascending : previousState.sortedColumn.failures),
                                    modes: (previousState.currentSelectedMenuItem === 'modes' ? ascending : previousState.sortedColumn.modes),
                                },
                                displayData: this.recomputeData(previousState.currentSelectedMenuItem, method, ascending),
                            }));
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default App;
