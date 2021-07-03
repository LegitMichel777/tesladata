import './App.css';
import React, { useState } from "react";
import ComponentIcon from './icons/component.svg'
import FailureIcon from './icons/failures.svg'
import ModeIcon from './icons/modes.svg'
import SearchIcon from './icons/magnifying.svg'
import PlusIcon from './icons/plus.svg'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSelectedMenuItem: "failures"
        };
    }
    changeCurrentSelectedMenuItem = (val) => {
        this.setState({
            currentSelectedMenuItem: val
        });
    };
    render() {
        return (
            <div id="masterContainer">
                <div id="masterInnerContainer">
                    <div id="topMenuContainer">
                        <TopMenu currentSelectedMenuItem={this.state.currentSelectedMenuItem} setSelectedMenuItem={this.changeCurrentSelectedMenuItem} />
                    </div>
                    <MainTable />
                </div>
            </div>
        );
    }
}

class MainTable extends React.Component {
    render() {
        return (
            <table id="MainTable">
                <tr id="TableHeader">
                    <th>#</th>
                    <th>Product Name</th>
                    <th>ID</th>
                    <th>Manufacturer</th>
                    <th>Contact</th>
                    <th>Fail Rate</th>
                </tr>
            </table>
        )
    }
}

const MenuItems = {
    component: "component",
    failures: "failures",
    modes: "modes"
};
function getDisplayName(menuItem) {
    switch (menuItem) {
        case "component":
            return "Components";
        case "failures":
            return "Failures";
        case "modes":
            return "Modes";
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
                    <div class="topSegEqual">
                        <AddButton />
                    </div>
                    <div id="mainSegmentedControl">
                        <MenuItem currentSelectedMenuItem={this.props.currentSelectedMenuItem} myMenuItem={"component"}
                                  onClick={() => this.handleMenuPress("component")}/>
                        <MenuItem currentSelectedMenuItem={this.props.currentSelectedMenuItem} myMenuItem={"failures"}
                                  onClick={() => this.handleMenuPress("failures")}/>
                        <MenuItem currentSelectedMenuItem={this.props.currentSelectedMenuItem} myMenuItem={"modes"}
                                  onClick={() => this.handleMenuPress("modes")}/>
                    </div>
                    <div class="topSegEqual">
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
                <img id="searchIcon" src={ getIcon("search") }/>
                <input type="text" class="beautiful-textfield" placeholder={"Search "+getDisplayName(this.props.currentSelectedMenuItem)}/>
            </div>
        )
    }
}

class AddButton extends React.Component {
    render() {
        return (
            <div id="addCircle">
                <div id="innerAddCircle">
                    <img id="plusIcon" src={ getIcon("plus") }/>
                </div>
            </div>
        )
    }
}

function getIcon(name) {
    switch (name) {
        case "component":
            return ComponentIcon;
        case "failures":
            return FailureIcon;
        case "modes":
            return ModeIcon;
        case "search":
            return SearchIcon;
        case "plus":
            return PlusIcon;
    }
}

class MenuItem extends React.Component {

    render() {
        const myItemSelected = this.props.myMenuItem === this.props.currentSelectedMenuItem;
        return (
            <div class={"segmentedControlOption segmentedControlOption" + (myItemSelected ? "Selected":"Deselected")} onClick={ this.props.onClick }>
                <div class={"segmentedControlImageWrapper "+(myItemSelected ? "segmentedItemSelected" : "segmentedItemDeselected")}>
                    <img class={ "segmentedControlIcon" } src={ getIcon(this.props.myMenuItem) }/>
                </div>
            </div>
        );
    }
}

class componentData {
    constructor(dbid, productname, id, manufacturer, contact, failrate) {
        this.dbid = dbid;
        this.productname = productname;
        this.id = id;
        this.manufacturer = manufacturer;
        this.contact = contact;
        this.failrate = failrate;
    }
    describe() {
        return ["Product Name", "ID", "Manufacturer", "Contact", "Fail Rate"];
    }
    getData() {
        return [this.productname, this.id, this.manufacturer, this.contact, this.failrate];
    }
}

let mockCompData=[new componentData(2, "why", "123", "are", "you", "42")];
class failures {
    constructor(componentid, failmode) {

    }
}

export default App;
