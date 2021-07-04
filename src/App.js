import './App.css';
import './Table/Table.css';
import {componentsData, failsData, modesData} from "./DataStructs";
import {MainTable} from './Table/Table'
import React from "react";
import './Table/Table'
import {TopMenu} from './TopMenu/TopMenu'

let mockCompData=[new componentsData(2, "why", "123", "are", "you", "42"), new componentsData(3, "i", "want", "everyone", "to", "43")];
let mockFailData=[new failsData(2, "", "Device", "", "Melted", "MELT"), new failsData(3, "", "Box", "", "Collapsed", "COLLPSE")];
let mockModeData=[];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.rawComponentsData=mockCompData;
        this.rawFailsData=mockFailData;
        this.rawModesData=mockModeData;
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
            displayData: this.recomputeData("failures", "num", true)
        };
    }
    changeCurrentSelectedMenuItem = (val) => {
        this.setState({
            currentSelectedMenuItem: val,
            displayData: this.recomputeData(val)
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
                        return aComp>bComp;
                    }
                    return aComp<bComp;
                })
            }
        }
        return displayData;
    }
    render() {
        return (
            <div id="masterContainer">
                <div id="masterInnerContainer">
                    <div id="topMenuContainer">
                        <TopMenu currentSelectedMenuItem={this.state.currentSelectedMenuItem} setSelectedMenuItem={this.changeCurrentSelectedMenuItem} />
                    </div>
                    <MainTable displayData={this.state.displayData} sortedColumn={this.state.sortedColumn[this.state.currentSelectedMenuItem]} sortMethodAscending={this.state.sortMethodAscending[this.state.currentSelectedMenuItem]} setSortMethod={(method, ascending) => {
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
