import './App.css';
import './Table/Table.css';
import {componentsData, failsData, modesData} from "./DataStructs";
import {MainTable} from './Table/Table'
import React from "react";
import './Table/Table'
import {TopMenu} from './TopMenu/TopMenu'
import httpCall from "./services/appAxios";

let mockCompData=[new componentsData(2, "why", "123", "are", "you", "42"), new componentsData(3, "i", "want", "everyone", "to", "43")];
let mockFailData=[new failsData(2, "", "Device", "", "Melted", "MELT"), new failsData(3, "", "Box", "", "Collapsed", "COLLPSE")];
let mockModeData=[];

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
            this.failsSelections=Array(this.rawFailsData.length);
            for (let i=0;i<this.rawComponentsData.length;i++) {
                this.componentSelections[i]=false;
            }
            for (let i=0;i<this.rawModesData.length;i++) {
                this.modesSelections[i]=false;
            }
            for (let i=0;i<this.rawFailsData.length;i++) {
                this.failsSelections[i]=false;
            }
        })
    }
    getHighlightData(selectedState=this.state.currentSelectedMenuItem) {
        switch (selectedState) {
            case "components":
                return this.componentSelections;
            case "modes":
                return this.modesSelections;
            case "failures":
                return this.failsSelections;
            default:
                console.log(`Tried to fetch highlight data for invalid state ${selectedState}`)
        }
    }
    componentWillMount() {
        this.fetchStructs().then(() => {
            this.setState({
                displayData: this.recomputeData("failures", "num", true),
                highlightData: this.getHighlightData("failures")
            });
        })
    }
    constructor(props) {
        super(props);
        this.componentsAnchor=-1;
        this.lastComponentsAction="";
        this.modesAnchor=-1;
        this.lastModesAction="";
        this.failuresAnchor=-1;
        this.lastFailuresAction="";
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
            displayData: [],
            highlightData: []
        };
    }
    changeCurrentSelectedMenuItem = (val) => {
        this.setState({
            currentSelectedMenuItem: val,
            displayData: this.recomputeData(val),
            highlightData: this.getHighlightData(val)
        });
    };
    recomputeData(selectedState=this.state.currentSelectedMenuItem, sortedColumn=null, sortMethodAscending=null) {
        if (sortedColumn === null) {
            sortedColumn = this.state.sortedColumn[selectedState];
        }
        if (sortMethodAscending === null) {
            sortMethodAscending = this.state.sortMethodAscending[selectedState];
        }
        console.log("Recomputing display data");
        let displayData = [];
        switch (selectedState) {
            case "components":
                displayData = this.rawComponentsData.slice();
                break;
            case "failures":
                displayData = this.rawFailsData.slice();
                break;
            case "modes":
                displayData = this.rawModesData.slice();
                break;
            default:
                console.log("Unknown selected state (" + selectedState + ")")
        }
        for (let i = 0; i < displayData.length; i++) {
            displayData[i].num = i + 1;
        }
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

        //required data for each state: anchor, lastAction
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
                               processClick={this.processClick}
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
