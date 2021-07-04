import './App.css';
import './Table/Table.css';
import {componentsData, failsData, modesData} from "./DataStructs";
import {MainTable} from './Table/Table'
import React from "react";
import './Table/Table'
import {getDisplayName, getIcon} from './utils'

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
                components: "Num",
                failures: "Num",
                modes: "Num"
            },
            sortMethodAscending: {
                components: true,
                failures: true,
                modes: true
            },
            displayData: this.recomputeData("failures")
        };
    }
    changeCurrentSelectedMenuItem = (val) => {
        this.setState({
            currentSelectedMenuItem: val,
            displayData: this.recomputeData(val)
        });
    };
    recomputeData(selectedState=this.state.currentSelectedMenuItem) {
        console.log("Recomputing display data");
        let displayData=[];
        switch(selectedState) {
            case "components":
                displayData=this.rawComponentsData;
                break;
            case "failures":
                displayData=this.rawFailsData;
                break;
            case "modes":
                displayData=this.rawModesData;
                break;
            default:
                console.log("Unknown selected state ("+selectedState+")")
        }
        console.log(displayData);
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
                            displayData: this.recomputeData()
                        });
                    }}/>
                </div>
            </div>
        );
    }
}

class TopMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    handleMenuPress(menuItem) {
        this.props.setSelectedMenuItem(menuItem);
    }
    render() {
        return (
            <div id="topMenu">
                <div id="topMenuMainSection">
                    <div className="topSegEqual">
                        <AddButton />
                    </div>
                    <div id="mainSegmentedControl">
                        <MenuItem currentSelectedMenuItem={this.props.currentSelectedMenuItem} myMenuItem={"components"}
                                  onClick={() => this.handleMenuPress("components")}/>
                        <MenuItem currentSelectedMenuItem={this.props.currentSelectedMenuItem} myMenuItem={"failures"}
                                  onClick={() => this.handleMenuPress("failures")}/>
                        <MenuItem currentSelectedMenuItem={this.props.currentSelectedMenuItem} myMenuItem={"modes"}
                                  onClick={() => this.handleMenuPress("modes")}/>
                    </div>
                    <div className="topSegEqual">
                        <SearchField currentSelectedMenuItem={this.props.currentSelectedMenuItem}/>
                    </div>
                </div>
                <div id="topMenuSelectedDisplay">
                    { getDisplayName(this.props.currentSelectedMenuItem) }
                </div>
            </div>
        );
    }
}

class SearchField extends React.Component {
    render() {
        return (
            <div id="mainSearchField">
                <img id="searchIcon" src={ getIcon("search") } alt={"Search Icon"}/>
                <input type="text" className="beautiful-textfield" placeholder={"Search "+getDisplayName(this.props.currentSelectedMenuItem)}/>
            </div>
        )
    }
}

class AddButton extends React.Component {
    render() {
        return (
            <div id="addCircle">
                <div id="innerAddCircle">
                    <img id="plusIcon" src={ getIcon("plus") } alt={"Plus Icon"}/>
                </div>
            </div>
        )
    }
}

class MenuItem extends React.Component {

    render() {
        const myItemSelected = this.props.myMenuItem === this.props.currentSelectedMenuItem;
        return (
            <div className={"segmentedControlOption segmentedControlOption" + (myItemSelected ? "Selected":"Deselected")} onClick={ this.props.onClick }>
                <div className={"segmentedControlImageWrapper "+(myItemSelected ? "segmentedItemSelected" : "segmentedItemDeselected")}>
                    <img className={ "segmentedControlIcon" } src={ getIcon(this.props.myMenuItem) }/>
                </div>
            </div>
        );
    }
}

export default App;
