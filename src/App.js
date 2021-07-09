import './App.css';
import './Table/Table.css';
import {componentsData, failsData, modesData} from "./DataStructs";
import {MainTable} from './Table/Table'
import React from "react";
import './Table/Table'
import {TopMenu} from './TopMenu/TopMenu'
import httpCall from "./services/appAxios";

class App extends React.Component {
    async fetchStructs() {
        let fetchRequests=[httpCall('http://127.0.0.1:5000/components/fetchAll'),
            httpCall('http://127.0.0.1:5000/fail_mode/fetchAll'),
            httpCall('http://127.0.0.1:5000/mapping/fetchAll')
        ]
        await Promise.all(fetchRequests).then((reqs_return) => {
            let gotComponentsData=reqs_return[0][0];
            let gotModesData=reqs_return[1][0];
            let gotFailsData=reqs_return[2][0];
            this.rawComponentsData=Array(gotComponentsData.length);
            for (let i=0;i<gotComponentsData.length;i++) {
                let current=gotComponentsData[i];
                this.rawComponentsData[i]=new componentsData(current["pkid"], current["productname"], current["id"], current["manufacturer"], current["contact"], current["failrate"]);
            }
            this.rawModesData=Array(gotModesData.length);
            for (let i=0;i<gotModesData.length;i++) {
                let current=gotModesData[i];
                this.rawModesData[i]=new modesData(current["pkid"], current["failname"], current["code"], current["id"]);
            }
            let componentsIdToIndexMap = new Map();
            let modesIdToIndexMap = new Map();
            for (let i=0;i<this.rawComponentsData.length;i++) {
                componentsIdToIndexMap.set(this.rawComponentsData[i].id, i);
            }
            for (let i=0;i<this.rawModesData.length;i++) {
                modesIdToIndexMap.set(this.rawModesData[i].id, i);
            }
            this.rawFailsData=Array(gotFailsData.length);
            for (let i=0;i<gotFailsData.length;i++) {
                let current=gotFailsData[i];
                let component_id=current["component_pkid"];
                let failmode_id=current["failmode_pkid"];
                console.log(component_id);
                console.log(failmode_id);
                let componentIndex=componentsIdToIndexMap.get(component_id);
                let failmodeIndex=modesIdToIndexMap.get(failmode_id);
                console.log(componentIndex);
                console.log(failmodeIndex);
                this.rawFailsData[i]=new failsData(current["pkid"], component_id, this.rawComponentsData[componentIndex].productname, failmode_id, this.rawModesData[failmodeIndex].failname, this.rawModesData[failmodeIndex].code)
            }

            // initialize the three selections array
            this.componentSelections=Array(this.rawComponentsData.length);
            this.modesSelections=Array(this.rawModesData.length);
            this.failuresSelections=Array(this.rawFailsData.length);
            for (let i=0;i<this.rawComponentsData.length;i++) {
                this.componentSelections[i]=false;
            }
            for (let i=0;i<this.rawModesData.length;i++) {
                this.modesSelections[i]=false;
            }
            for (let i=0;i<this.rawFailsData.length;i++) {
                this.failuresSelections[i]=false;
            }
        })
    }
    componentWillMount() {
        this.fetchStructs().then(() => {
            this.setState({
                displayData: this.recomputeData("failures", "num", true),
            });
        })
    }
    constructor(props) {
        super(props);
        this.selectionAnchor=-1;
        this.selectionLastAction="";
        this.componentsSelectedCache=[]; //selection cache is in database sorting
        this.modesSelectedCache=[];
        this.failuresSelectedCache=[];
        this.currentSortToDbMapping=[];
        this.currentDbToSortMapping=[];
        this.state = {
            currentSelectedMenuItem: "failures",
            sortedColumn: {
                components: "num",
                failures: "num",
                modes: "num"
            },
            sortMethodAscending: {
                components: true,
                failures: true,
                modes: true
            },
            displayData: []
        };
    }
    changeCurrentSelectedMenuItem = (val) => {
        this.setState({
            currentSelectedMenuItem: val,
            displayData: this.recomputeData(val),
        });
    };
    recomputeData(selectedState=this.state.currentSelectedMenuItem, sortedColumn=null, sortMethodAscending=null) {
        this.selectionAnchor=-1;
        this.selectionLastAction="";
        if (sortedColumn === null) {
            sortedColumn = this.state.sortedColumn[selectedState];
        }
        if (sortMethodAscending === null) {
            sortMethodAscending = this.state.sortMethodAscending[selectedState];
        }
        console.log("Recomputing display data");
        let displayData = [];
        let accompanyingSelectionData=[];
        switch (selectedState) {
            case "components":
                displayData = this.rawComponentsData.slice();
                accompanyingSelectionData = this.componentSelections;
                break;
            case "failures":
                displayData = this.rawFailsData.slice();
                accompanyingSelectionData = this.failuresSelections;
                break;
            case "modes":
                displayData = this.rawModesData.slice();
                accompanyingSelectionData = this.modesSelections;
                break;
            default:
                console.log("Unknown selected state (" + selectedState + ")")
        }
        for (let i = 0; i < displayData.length; i++) {
            displayData[i].num = i + 1;
            displayData[i].selected = accompanyingSelectionData[i];
        }
        this.currentSortToDbMapping=Array(displayData.length);
        this.currentDbToSortMapping=Array(displayData.length);
        if (displayData.length > 0) {
            if (sortedColumn === "num") {
                if (!sortMethodAscending) {
                    displayData.reverse();
                }
            } else {
                let elementsDescription=displayData[0].getIds();
                let sortBy=-1;
                for (let i=0;i<elementsDescription.length;i++) {
                    if (elementsDescription[i]===sortedColumn) {
                        sortBy=i;
                    }
                }
                if (sortBy===-1) {
                    console.log("Cannot find sort column ID "+sortedColumn);
                    return displayData;
                }
                displayData.sort((a, b) => {
                    let aData=a.getData();
                    let bData=b.getData();
                    let aComp=aData[sortBy];
                    let bComp=bData[sortBy];
                    if (sortMethodAscending) {
                        return (aComp>bComp ? 1 : -1);
                    }
                    return (aComp<bComp ? 1 : -1);
                });
            }
            for (let i=0;i<displayData.length;i++) {
                this.currentSortToDbMapping[i]=displayData[i].num-1;
            }
            for (let i=0;i<displayData.length;i++) {
                this.currentDbToSortMapping[this.currentSortToDbMapping[i]]=i;
            }
        }
        return displayData;
    }
    processClick(tableRow, action) {
        console.log("Process click");
        console.log(tableRow);
        console.log(action);
        //single select -> deselect everything and only select one. set this to the anchor.
        //multi select -> toggle the selection on that one. if it is now selected, set it to the anchor.
        // if it isn't selected. set the anchor to no anchor.
        //range select -> look at the anchor. if there is no anchor, simply treat this as a multi-select (but without setting another anchor)
        // if there is an anchor, use it and LEAVE IT THERE.
        // if the last action was a multi-select, completely erase its selection and do the selection.
        // remember to set the anchor to none every time the table is resorted

        //required data for each state: anchor, lastAction
        //IMPORTANT: Anchor is in terms of current coordinates
        let relSelectionArray, relSelectionCache;
        switch (tableRow.tableType) {
            case "components":
                relSelectionArray=this.componentSelections;
                relSelectionCache=this.componentsSelectedCache;
                break;
            case "failures":
                relSelectionArray=this.failuresSelections;
                relSelectionCache=this.failuresSelectedCache;
                break;
            case "modes":
                relSelectionArray=this.modesSelections;
                relSelectionCache=this.modesSelectedCache;
                break;
            default:
                console.log(`Processing click for unknown table type ${tableRow.tableType}`);
        }
        let selectIndex=tableRow.tableIndex;
        let newDisplayData=this.state.displayData.slice();

        if (action==="single") {
            for (let i=0;i<relSelectionCache.length;i++) {
                relSelectionArray[relSelectionCache[i]]=false;
            }
            let dbIndex=this.currentSortToDbMapping[selectIndex];
            relSelectionArray[dbIndex]=true;
            for (let i=0;i<relSelectionCache.length;i++) {
                newDisplayData[this.currentDbToSortMapping[relSelectionCache[i]]].selected=false;
            }
            newDisplayData[selectIndex].selected=true;
            relSelectionCache=[dbIndex];
            this.selectionLastAction = {
                action: "single",
                params: selectIndex
            }
            this.selectionAnchor=selectIndex;
        } else if (action==="multi"||(action==='range'&&this.selectionAnchor===-1)) {
            let dbIndex=this.currentSortToDbMapping[selectIndex];
            if (relSelectionArray[dbIndex]) {
                // remove the selection and set anchor to none
                relSelectionArray[dbIndex]=false;
                newDisplayData[selectIndex].selected=false;
                for (let i=0;i<relSelectionCache.length;i++) {
                    if (relSelectionCache[i]===dbIndex) {
                        relSelectionCache.splice(i,1);
                    }
                }
                this.selectionAnchor=-1;
            } else {
                // add the selection and set anchor to the selection
                relSelectionArray[dbIndex]=true;
                newDisplayData[selectIndex].selected=true;
                relSelectionCache.push(dbIndex);
                if (action!=='range') {
                    this.selectionAnchor = selectIndex;
                }
            }
            if (action==='range') {
                this.selectionLastAction = {
                    action: 'range_multi_fallback',
                    params: selectIndex
                }
            } else {
                this.selectionLastAction = {
                    action: "multi",
                    params: selectIndex
                };
            }
        } else if (action==='range') {
            if (this.selectionLastAction.action==='range') {
                let erase_l, erase_r;
                erase_l=Math.min(this.selectionAnchor, this.selectionLastAction.params);
                erase_r=Math.max(this.selectionAnchor, this.selectionLastAction.params);
                for (let i=erase_l;i<=erase_r;i++) {
                    relSelectionArray[this.currentSortToDbMapping[i]]=false;
                    newDisplayData[i].selected=false;
                }
                for (let i=0;i<relSelectionCache.length;i++) {
                    if (this.currentDbToSortMapping[relSelectionCache[i]]>=erase_l&&this.currentDbToSortMapping[relSelectionCache[i]]<=erase_r) {
                        relSelectionCache.splice(i,1);
                        i--;
                    }
                }
                console.log("Trying to erase ")
                console.log(erase_l);
                console.log(erase_r);
            }
            let l,r;
            l=Math.min(selectIndex, this.selectionAnchor);
            r=Math.max(selectIndex, this.selectionAnchor);
            for (let i=l;i<=r;i++) {
                if (!relSelectionArray[this.currentSortToDbMapping[i]]) {
                    relSelectionCache.push(this.currentSortToDbMapping[i]);
                }
                relSelectionArray[this.currentSortToDbMapping[i]]=true;
                newDisplayData[i].selected=true;
            }
            console.log("range selecting")
            console.log(l);
            console.log(r);
            this.selectionLastAction = {
                action: "range",
                params: selectIndex
            };
        }
        switch (tableRow.tableType) {
            case "components":
                this.componentSelections=relSelectionArray;
                this.componentsSelectedCache=relSelectionCache;
                break;
            case "failures":
                this.failuresSelections=relSelectionArray;
                this.failuresSelectedCache=relSelectionCache;
                break;
            case "modes":
                this.modesSelections=relSelectionArray;
                this.modesSelectedCache=relSelectionCache;
                break;
            default:
                console.log(`Processing click for unknown table type ${tableRow.tableType}`);
        }
        this.setState({
            displayData: newDisplayData
        });
    }
    async serverRequestDelete() {

    }
    deleteSelection() {

    }
    render() {
        return (
            <div id="masterContainer" className={window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark-theme" : ""}>
                <div id="masterInnerContainer">
                    <div id="topMenuContainer">
                        <TopMenu currentSelectedMenuItem={this.state.currentSelectedMenuItem} setSelectedMenuItem={this.changeCurrentSelectedMenuItem} />
                    </div>
                    <MainTable displayData={this.state.displayData}
                               sortedColumn={this.state.sortedColumn[this.state.currentSelectedMenuItem]}
                               sortMethodAscending={this.state.sortMethodAscending[this.state.currentSelectedMenuItem]}
                               tableType={this.state.currentSelectedMenuItem}
                               processClick={this.processClick.bind(this)}
                               highlightData={this.state.highlightData}
                               setSortMethod={(method, ascending) => {
                        this.setState({
                            sortedColumn: {
                                components: (this.state.currentSelectedMenuItem === "components" ? method : this.state.sortedColumn['components']),
                                failures: (this.state.currentSelectedMenuItem === "failures" ? method : this.state.sortedColumn['failures']),
                                modes: (this.state.currentSelectedMenuItem === "modes" ? method : this.state.sortedColumn['modes'])
                            }, sortMethodAscending: {
                                components: (this.state.currentSelectedMenuItem === "components" ? ascending : this.state.sortedColumn['components']),
                                failures: (this.state.currentSelectedMenuItem === "failures" ? ascending : this.state.sortedColumn['failures']),
                                modes: (this.state.currentSelectedMenuItem === "modes" ? ascending : this.state.sortedColumn['modes'])
                            },
                            displayData: this.recomputeData(this.state.currentSelectedMenuItem, method, ascending)
                        });
                    }}/>
                </div>
            </div>
        );
    }
}

export default App;
