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
import httpCall from './services/httpCall';
import DeleteModal from './Modals/DeleteModal/deleteModal';
import AddEditModal from './Modals/AddEditModal/addEditModal';
import { getDisplayName, getSingularDisplayName } from './utils';
import serverRequestAdd from './services/serverRequestAdd';
import serverRequestUpdate from './services/serverRequestUpdate';
import * as globals from './globals';
import cleanseInput from './DataStructs/cleanseInput';
import dataSearch from './dataSearch';
import rootTypeToState from './DataStructs/rootTypeToState';
import getCorrespondingDisplayNameOfColumnId from './DataStructs/getCorrespondingDisplayNameOfColumnId';
import autocompleteSearch from './autocompleteSearch';

class App extends React.Component {
    async fetchComponents() {
        const callUrl=`${globals.rootURL}/components/fetchAll`;
        const rawData=this.rawComponentsData;
        const relevantSelections=this.componentSelections;
        const relevantSelectionCache=this.componentsSelectedCache;
        await httpCall(callUrl).then((reqsReturn) => {
            relevantSelectionCache.length=0;
            const gottenData = reqsReturn[0];
            let newRawData = Array(gottenData.length);
            for (let i = 0; i < gottenData.length; i++) {
                const current = gottenData[i];
                newRawData[i] = new ComponentsData(current.pkid,
                    current.productname,
                    current.manufacturer,
                    current.contact,
                    current.failrate);
            }

            this.componentSelections=this.realignSelections(rawData, gottenData, relevantSelectionCache, relevantSelections, newRawData);
            this.rawComponentsData=newRawData;
        });
    }

    async fetchModes() {
        const callUrl=`${globals.rootURL}/fail_mode/fetchAll`;
        const rawData=this.rawModesData;
        const relevantSelections=this.modesSelections;
        const relevantSelectionCache=this.modesSelectedCache;
        await httpCall(callUrl).then((reqsReturn) => {
            relevantSelectionCache.length=0;
            const gottenData = reqsReturn[0];
            let newRawData = Array(gottenData.length);
            for (let i = 0; i < gottenData.length; i++) {
                const current = gottenData[i];
                newRawData[i] = new ModesData(current.pkid,
                    current.failname,
                    current.code,
                    current.description);
            }

            this.modesSelections=this.realignSelections(rawData, gottenData, relevantSelectionCache, relevantSelections, newRawData);
            this.rawModesData=newRawData;
        });
    }

    // eslint-disable-next-line class-methods-use-this
    realignSelections(rawData, gottenData, relevantSelectionCache, relevantSelections, newRawData) {
        let pkidToOldIndexMap = new Map();
        for (let i=0;i<rawData.length;i++) {
            pkidToOldIndexMap.set(rawData[i].dbid, i);
        }
        let newSelectionData=Array(gottenData.length);
        for (let i=0;i<newRawData.length;i++) {
            let oldIndex=pkidToOldIndexMap.get(newRawData[i].dbid);
            if (oldIndex===undefined) {
                newSelectionData[i]=false;
            } else {
                newSelectionData[i]=relevantSelections[oldIndex];
                if (newSelectionData[i]) {
                    relevantSelectionCache.push(i);
                }
            }
        }
        return newSelectionData;
    }

    async fetchFailures() {
        const callUrl=`${globals.rootURL}/mapping/fetchAll`;
        const rawData=this.rawFailsData;
        const relevantSelections=this.failuresSelections;
        const relevantSelectionCache=this.failuresSelectedCache;
        await httpCall(callUrl).then((reqsReturn) => {
            relevantSelectionCache.length=0;
            const gottenData = reqsReturn[0];
            let newRawData = Array(gottenData.length);
            for (let i = 0; i < gottenData.length; i++) {
                const current = gottenData[i];
                newRawData[i] = new FailsData(current.pkid,
                    current.failComponentId,
                    current.failComponentName,
                    current.failModeId,
                    current.failModeName,
                    current.failCode,
                    current.failDescription);
            }

            this.failuresSelections=this.realignSelections(rawData, gottenData, relevantSelectionCache, relevantSelections, newRawData);
            this.rawFailsData=newRawData;
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
            dataLength: -1,
            isInSearch: false,
            searchColumn: {
                components: 'productname',
                failures: 'failedcomponent',
                modes: 'name',
            },
            searchContents: "",
            editModalShown: false,
            additionalEditInfo: {},
        };
    }

    componentDidMount() {
        this.fetchFailures().then(() => {
            this.recomputeData('failures', 'num', true);
        });
    }

    changeCurrentSelectedMenuItem(val) {
        this.recomputeData(val);
        this.setState({
            currentSelectedMenuItem: val,
            searchContents: "",
        });
        switch (val) {
        case "components":
            this.fetchComponents()
                .then(() => {
                    this.recomputeData('components', this.state.sortedColumn.components, this.state.sortMethodAscending.components, "", false, this.state.searchColumn.components);
                });
            break;
        case "failures":
            this.fetchFailures()
                .then(() => {
                    this.recomputeData('failures', this.state.sortedColumn.failures, this.state.sortMethodAscending.failures, "", false, this.state.searchColumn.failures);
                });
            break;
        case "modes":
            this.fetchModes()
                .then(() => {
                    this.recomputeData('modes', this.state.sortedColumn.modes, this.state.sortMethodAscending.modes, "", false, this.state.searchColumn.modes);
                });
            break;
        default:
            console.log(`Invalid menu item change ${val}`);
        }
    }

    getRawData(selectedState = this.state.currentSelectedMenuItem) {
        switch (selectedState) {
        case 'components':
            return this.rawComponentsData;
        case 'failures':
            return this.rawFailsData;
        case 'modes':
            return this.rawModesData;
        default:
            console.log(`Get raw data called on invalid state ${selectedState}.`);
            return undefined;
        }
    }

    recomputeData(selectedState = this.state.currentSelectedMenuItem, sortedColumn = this.state.sortedColumn[selectedState], sortMethodAscending = this.state.sortMethodAscending[selectedState], searchContents = this.state.searchContents, isInSearch = this.state.isInSearch, searchColumn = this.state.searchColumn[this.state.currentSelectedMenuItem]) {
        this.selectionAnchor = -1;
        this.selectionLastAction = '';
        console.log('Recomputing display data');
        let accompanyingSelectionData = [];
        switch (selectedState) {
        case 'components':
            accompanyingSelectionData = this.componentSelections;
            break;
        case 'failures':
            accompanyingSelectionData = this.failuresSelections;
            break;
        case 'modes':
            accompanyingSelectionData = this.modesSelections;
            break;
        default:
            console.log(`Unknown selected state (${selectedState})`);
        }
        let displayData = this.getRawData(selectedState).slice();
        for (let i = 0; i < displayData.length; i++) {
            displayData[i].num = i + 1;
            displayData[i].selected = accompanyingSelectionData[i];
        }
        if (isInSearch) {
            displayData=dataSearch(displayData, searchColumn, searchContents);
            for (let i=0;i<displayData.length;i++) {
                displayData[i]=displayData[i].data;
            }
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
        this.setState({
            displayData: displayData,
            dataLength: displayData.length,
        });
        return null;
    }

    getRelSelectionArrayAndCache(currentMenuState = this.state.currentSelectedMenuItem) {
        let relSelectionArray;
        let relSelectionCache;
        switch (currentMenuState) {
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
            console.log(`Getting relevant selection and cache for unknown table type ${currentMenuState}`);
        }
        return [relSelectionArray, relSelectionCache];
    }

    handleDeSelectAllButtonPressed() {
        const shouldSelectAll = this.selectionToggleButtonIsSelectAll();
        const [relSelectionArray, relSelectionCache] = this.getRelSelectionArrayAndCache();
        // clear the cache
        relSelectionCache.length = 0;
        for (let i = 0; i < this.state.displayData.length; i++) {
            relSelectionArray[this.currentSortToDbMapping[i]] = shouldSelectAll;
        }
        for (let i=0;i<relSelectionArray.length;i++) {
            if (relSelectionArray[i]) {
                relSelectionCache.push(i);
            }
        }
        const newDisplayData = this.state.displayData.slice();
        for (let i = 0; i < newDisplayData.length; i++) {
            newDisplayData[i].selected = shouldSelectAll;
        }
        this.setState({
            displayData: newDisplayData,
        });
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
        // eslint-disable-next-line prefer-const
        let [relSelectionArray, relSelectionCache] = this.getRelSelectionArrayAndCache(tableRow.tableType);
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
                if (this.currentDbToSortMapping[relSelectionCache[i]] !== undefined) {
                    newDisplayData[this.currentDbToSortMapping[relSelectionCache[i]]].selected = false;
                }
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

    async getSelectedDetails() {
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
            await this.fetchFailures();
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
        const selectionDetails = await this.getSelectedDetails();
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
            this.recomputeData();
            this.selectionAnchor=-1;
        }
    }

    async confirmAndDelete() {
    // generate a confirmation message and show the modal
        let nextConfirmMessage;
        const selectionDetails = await this.getSelectedDetails();
        const selectionCache = selectionDetails[0];
        const willDelete = selectionDetails[3].length;
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

    selectionToggleButtonIsSelectAll() {
        // determines whether or not the selection button is select all
        if (this.state.dataLength === 0) {
            return true;
        }
        return this.getCurrentNumberOfSelections() !== this.state.dataLength;
    }

    generateNewObject(currentState = this.state.currentSelectedMenuItem, args) {
        const curPrototype = getPrototype(currentState).constructor;
        const isRootType = curPrototype.rootDescribe !== undefined;
        const identifiers = isRootType ? curPrototype.rootTypes : curPrototype.getIds;
        const serverObj = {};
        if (args.length === identifiers.length) {
            for (let i = 0; i < identifiers.length; i++) {
                serverObj[identifiers[i]] = isRootType ? this.fetchInfoByIndex(rootTypeToState(curPrototype.rootTypes[i]), args[i]).dbid : cleanseInput(args[i]);
            }
        } else {
            console.log(`Generate new object: argument length mismatch`);
            return {};
        }

        let dataStructObj;
        let linkedComponentIndex=-1;
        let linkedModeIndex=-1;
        switch (currentState) {
        case 'components':
            dataStructObj=new ComponentsData(-1, serverObj.productname, serverObj.manufacturer, serverObj.contact, serverObj.failrate);
            break;
        case 'failures':
            for (let i=0;i<this.rawComponentsData.length;i++) {
                if (this.rawComponentsData[i].dbid===serverObj.component_pkid) {
                    linkedComponentIndex=i;
                }
            }
            for (let i=0;i<this.rawModesData.length;i++) {
                if (this.rawModesData[i].dbid===serverObj.mode_pkid) {
                    linkedModeIndex=i;
                }
            }
            if (linkedComponentIndex===-1||linkedModeIndex===-1) {
                console.log(`Generate new object: linked component or linked mode not found.`);
                return {};
            }
            dataStructObj=new FailsData(-1, serverObj.component_pkid, this.rawComponentsData[linkedComponentIndex].productname, serverObj.mode_pkid, this.rawModesData[linkedModeIndex].failname, this.rawModesData[linkedModeIndex].code, this.rawModesData[linkedModeIndex].description);
            break;
        case 'modes':
            dataStructObj=new ModesData(-1, serverObj.name, serverObj.code, serverObj.description);
            break;
        default:
            console.log(`Creating object called on invalid menu item ${currentState}`);
        }
        return { serverObj, dataStructObj };
    }

    createAndAddObject(dataStructObj, currentState) {
        const [relSelectionArray, relSelectionCache] = this.getRelSelectionArrayAndCache(currentState);
        switch (currentState) {
        case 'components':
            this.rawComponentsData.unshift(dataStructObj);
            break;
        case 'failures':
            this.rawFailsData.unshift(dataStructObj);
            break;
        case 'modes':
            this.rawModesData.unshift(dataStructObj);
            break;
        default:
            console.log(`Creating object called on invalid menu item ${currentState}`);
        }
        relSelectionArray.unshift(false);
        for (let i=0;i<relSelectionCache.length;i++) {
            relSelectionCache[i]++;
        }
        this.selectionAnchor=-1;
        this.recomputeData();
    }

    updateObject(dataStructObj, index, currentState) {
        switch (currentState) {
        case 'components':
            this.rawComponentsData[index]=dataStructObj;
            for (let i=0;i<this.rawFailsData.length;i++) {
                if (this.rawFailsData[i].failComponentId === this.rawComponentsData[index].dbid) {
                    this.rawFailsData[i].failComponentName = this.rawComponentsData[index].productname;
                }
            }
            break;
        case 'failures':
            this.rawFailsData[index]=dataStructObj;
            break;
        case 'modes':
            this.rawModesData[index]=dataStructObj;
            for (let i=0;i<this.rawFailsData.length;i++) {
                if (this.rawFailsData[i].failModeId === this.rawModesData[index].dbid) {
                    this.rawFailsData[i].failModeName = this.rawModesData[index].failname;
                    this.rawFailsData[i].failCode = this.rawModesData[index].code;
                    this.rawFailsData[i].failDescription = this.rawModesData[index].description;
                }
            }
            break;
        default:
            console.log(`Updating object called on invalid menu item ${currentState}`);
        }
        this.recomputeData();
    }

    fetchInfoByIndex(state, index) {
        switch (state) {
        case 'components':
            return this.rawComponentsData[index];
        case 'failures':
            return this.rawFailsData[index];
        case 'modes':
            return this.rawModesData[index];
        default:
            console.log(`Fetch info on index called on invalid menu item ${state}`);
        }
        return null;
    }

    async fetchRootDataByDbid(type, dbid, performFetch) {
        let match = -1;
        let rawMatchData=(type==='component_pkid' ? this.rawComponentsData : this.rawModesData);
        for (let j=0;j<rawMatchData.length;j++) {
            if (rawMatchData[j].dbid === dbid) {
                match=j;
                break;
            }
        }
        let didGoFetch = false;
        if (match === -1 && performFetch) {
            didGoFetch=true;
            if (type==='component_pkid') {
                await this.fetchComponents();
                [match] = await this.fetchRootDataByDbid(type, dbid, false);
            } else {
                await this.fetchModes();
                [match] = await this.fetchRootDataByDbid(type, dbid, false);
            }
        }
        return [match, didGoFetch];
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
                <AddEditModal
                    modalType="add"
                    show={this.state.addModalShown}
                    submitClicked={(args) => {
                        let { serverObj, dataStructObj } = this.generateNewObject(this.state.currentSelectedMenuItem, args);
                        if (serverObj === undefined || dataStructObj === undefined) {
                            return;
                        }
                        serverRequestAdd(serverObj, this.state.currentSelectedMenuItem).then((res) => {
                            // eslint-disable-next-line prefer-destructuring
                            dataStructObj.dbid=res.data[0];
                            this.createAndAddObject(dataStructObj, this.state.currentSelectedMenuItem);
                        });
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
                    autocompleteSearch={autocompleteSearch.bind(this)}
                    fetchInfoByIndex={this.fetchInfoByIndex.bind(this)}
                    additionalEditInfo={{}}
                />
                <AddEditModal
                    modalType="edit"
                    show={this.state.editModalShown}
                    submitClicked={(args) => {
                        let { serverObj, dataStructObj }= this.generateNewObject(this.state.currentSelectedMenuItem, args);
                        if (serverObj === undefined || dataStructObj === undefined) {
                            return;
                        }
                        let { index } = this.state.additionalEditInfo;
                        switch (this.state.currentSelectedMenuItem) {
                        case "components":
                            serverObj.pkid=this.rawComponentsData[index].dbid;
                            dataStructObj.dbid=this.rawComponentsData[index].dbid;
                            break;
                        case "failures":
                            serverObj.pkid=this.rawFailsData[index].dbid;
                            dataStructObj.dbid=this.rawFailsData[index].dbid;
                            break;
                        case "modes":
                            serverObj.pkid=this.rawModesData[index].dbid;
                            dataStructObj.dbid=this.rawModesData[index].dbid;
                            break;
                        default:
                            console.log(`Tried to assign pkid with invalid state ${this.state.currentSelectedMenuItem}`);
                        }
                        serverRequestUpdate(serverObj, this.state.currentSelectedMenuItem).then(() => {
                            this.updateObject(dataStructObj, index, this.state.currentSelectedMenuItem);
                        });
                        this.setState({
                            editModalShown: false,
                        });
                    }}
                    cancelClicked={() => {
                        this.setState({
                            editModalShown: false,
                        });
                    }}
                    addItemDisplayTitle={getSingularDisplayName(this.state.currentSelectedMenuItem)}
                    objectPrototype={getPrototype(this.state.currentSelectedMenuItem)}
                    autocompleteSearch={autocompleteSearch.bind(this)}
                    fetchInfoByIndex={this.fetchInfoByIndex.bind(this)}
                    additionalEditInfo={this.state.additionalEditInfo}
                />
                <div id="masterInnerContainer">
                    <div id="topMenuContainer">
                        <TopMenu
                            currentSelectedMenuItem={this.state.currentSelectedMenuItem}
                            setSelectedMenuItem={this.changeCurrentSelectedMenuItem.bind(this)}
                            deleteEnabled={this.checkDeleteEnabled()}
                            editEnabled={this.checkEditEnabled()}
                            performDelete={this.confirmAndDelete.bind(this)}
                            performAdd={async () => {
                                this.setState({
                                    addModalShown: true,
                                });
                                let isRootType = getPrototype(this.state.currentSelectedMenuItem).constructor.rootDescribe !== undefined;
                                if (isRootType) {
                                    let types=getPrototype(this.state.currentSelectedMenuItem).constructor.rootTypes;
                                    for (let i=0;i<types.length;i++) {
                                        if (types[i]==='component_pkid' || types[i]==='mode_pkid') {
                                            if (types[i]==='component_pkid') {
                                                this.fetchComponents();
                                            } else {
                                                this.fetchModes();
                                            }
                                        } else {
                                            console.log(`Unrecognized root type ${types[i]}`);
                                        }
                                    }
                                }
                            }}
                            performEdit={async () => {
                                let [selectionCache, rawData, , relatedFailureDeletions] = await this.getSelectedDetails();
                                if (selectionCache.length !== 1) {
                                    return;
                                }
                                let editIndex=selectionCache[0];
                                let name;
                                switch (this.state.currentSelectedMenuItem) {
                                case 'components':
                                    name=rawData[editIndex].productname;
                                    break;
                                case 'failures':
                                    name='Failure';
                                    break;
                                case 'mode':
                                    name=rawData[editIndex].failname;
                                    break;
                                default:
                                    console.log(`Perform edit called on unexpected state ${this.state.currentSelectedMenuItem}`);
                                }
                                let sub=`Database ID ${rawData[editIndex].dbid}`;
                                if (relatedFailureDeletions.length>0) {
                                    sub=`${sub} • ${getSingularDisplayName(this.state.currentSelectedMenuItem)} associated with ${relatedFailureDeletions.length} Mapping${relatedFailureDeletions.length>1 ? "s" : ""}`;
                                }
                                let isRootType = rawData[editIndex].constructor.rootDescribe !== undefined;
                                let rootData=[];
                                if (isRootType) {
                                    let types=rawData[editIndex].constructor.rootTypes;
                                    let rawRootData=rawData[editIndex].getRootData();

                                    let fetchJobs=[];
                                    for (let i=0;i<types.length;i++) {
                                        if (types[i]==='component_pkid' || types[i]==='mode_pkid') {
                                            fetchJobs.push(this.fetchRootDataByDbid(types[i], rawRootData[i], true));
                                        } else {
                                            console.log(`Unrecognized root type ${types[i]}`);
                                        }
                                    }
                                    let results = await Promise.all(fetchJobs);
                                    for (let i=0;i<types.length;i++) {
                                        // eslint-disable-next-line no-await-in-loop
                                        let [match, fetched] = results[i];
                                        if (!fetched) {
                                            if (types[i] === 'component_pkid') {
                                                this.fetchComponents();
                                            } else {
                                                this.fetchModes();
                                            }
                                        }
                                        if (match === -1) {
                                            console.log(`Failed to load edit view, couldn't find ${types[i]==='component_pkid' ? 'Component' : 'Mode'} with database ID ${rawRootData[i]}`);
                                            return;
                                        }
                                        rootData.push(match);
                                    }
                                }
                                this.setState({
                                    editModalShown: true,
                                    additionalEditInfo: {
                                        index: editIndex,
                                        name: name,
                                        sub: sub,
                                        data: isRootType ? rootData : rawData[editIndex].getData(),
                                    },
                                });
                            }}
                            performDeSelectAll={this.handleDeSelectAllButtonPressed.bind(this)}
                            selectionToggleButtonIsSelectAll={this.selectionToggleButtonIsSelectAll()}
                            setSearchActive={(val) => {
                                if (!val && this.state.searchContents !== '') {
                                    return;
                                }
                                this.setState({
                                    isInSearch: val,
                                });
                            }}
                            searchContents={this.state.searchContents}
                            setSearchContents={(val) => {
                                this.setState({
                                    searchContents: val,
                                });
                                this.recomputeData(undefined, undefined, undefined, val, true);
                                // actually do the search now
                            }}
                            searchTip={this.state.isInSearch ? `${getDisplayName(this.state.currentSelectedMenuItem)}: Searching ${getCorrespondingDisplayNameOfColumnId(getPrototype(this.state.currentSelectedMenuItem), this.state.searchColumn[this.state.currentSelectedMenuItem])}` : ''}
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
                        handleHeaderClick={(id, cmdOrOptionHeld) => {
                            if (!this.state.isInSearch || (this.state.isInSearch && cmdOrOptionHeld)) {
                                let newSortedColumn = { ...this.state.sortedColumn };
                                let newSortMethodAscending = { ...this.state.sortMethodAscending };

                                if (id === newSortedColumn[this.state.currentSelectedMenuItem]) {
                                    newSortMethodAscending[this.state.currentSelectedMenuItem] = !newSortMethodAscending[this.state.currentSelectedMenuItem];
                                } else {
                                    newSortedColumn[this.state.currentSelectedMenuItem] = id;
                                    newSortMethodAscending[this.state.currentSelectedMenuItem] = true;
                                }
                                this.recomputeData(this.state.currentSelectedMenuItem, newSortedColumn[this.state.currentSelectedMenuItem], newSortMethodAscending[this.state.currentSelectedMenuItem]);
                                this.setState(() => ({
                                    sortedColumn: newSortedColumn,
                                    sortMethodAscending: newSortMethodAscending,
                                }));
                            } else {
                                if (id === 'num') {
                                    return;
                                }
                                let newSearchColumn = { ...this.state.searchColumn };
                                newSearchColumn[this.state.currentSelectedMenuItem] = id;
                                this.setState({
                                    searchColumn: newSearchColumn,
                                });
                                this.recomputeData(undefined, undefined, undefined, undefined, undefined, id);
                            }
                        }}
                        isInSearch={this.state.isInSearch}
                        searchColumn={this.state.searchColumn[this.state.currentSelectedMenuItem]}
                    />
                </div>
            </div>
        );
    }
}

export default App;
