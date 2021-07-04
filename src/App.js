import './App.css';
import './Table.css';
import React, { useState } from "react";
import ComponentIcon from './icons/component.svg'
import FailureIcon from './icons/failures.svg'
import ModeIcon from './icons/modes.svg'
import SearchIcon from './icons/magnifying.svg'
import PlusIcon from './icons/plus.svg'
import ArrowUp from './icons/arrowup.svg'
import ArrowDown from './icons/arrowdown.svg'

class componentsData {
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
    getids() {
        return ["productname", "id", "manufacturer", "contact", "failrate"];
    }
    getData() {
        return [this.productname, this.id, this.manufacturer, this.contact, this.failrate];
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
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
            }
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
                    <MainTable sortedColumn={this.state.sortedColumn[this.state.currentSelectedMenuItem]} sortMethodAscending={this.state.sortMethodAscending[this.state.currentSelectedMenuItem]} setSortMethod={(method, ascending) => {
                        this.setState({
                            sortedColumn: {
                                components: (this.state.currentSelectedMenuItem === "components" ? method : this.state.sortedColumn['components']),
                                failures: (this.state.currentSelectedMenuItem === "failures" ? method : this.state.sortedColumn['failures']),
                                modes: (this.state.currentSelectedMenuItem === "modes" ? method : this.state.sortedColumn['modes'])
                            }, sortMethodAscending: {
                                components: (this.state.currentSelectedMenuItem === "components" ? ascending : this.state.sortedColumn['components']),
                                failures: (this.state.currentSelectedMenuItem === "failures" ? ascending : this.state.sortedColumn['failures']),
                                modes: (this.state.currentSelectedMenuItem === "modes" ? ascending : this.state.sortedColumn['modes'])
                            }
                        })
                    }}/>
                </div>
            </div>
        );
    }
}

class TableSeparator extends React.Component {
    render() {
        let children = Array(this.props.multiples);
        children[0]=(<td key={"TableSeparator0"}>
            <div className="tdTableSeparatorHead" />
        </td>);
        for (let i=1;i<this.props.multiples;i++) {
            children[i]=<td key={"TableSeparator"+i}>
                <div className="tdTableSeparator" />
            </td>
        }
        return React.createElement('tr', null, children);
    }
}

class TableHeaderItem extends React.Component {
    render() {
        // parameters: what to display, my id, the currently being sorted id, which way its being sorted
        let iAmSort=this.props.myId===this.props.curSortId;
        return <th onClick={() => {
            if (iAmSort) {
                this.props.setSortMethod(this.props.myId, !this.props.curSortMode);
            } else {
                this.props.setSortMethod(this.props.myId, true);
            }
        }} className={"TableHeaderTh"}>
            <div className={"tableHeaderItem"+(iAmSort ? "Highlighted" : "Unhighlighted")}>
                <div>{ this.props.displayItem }</div>
                <div className={"tableHeaderSort"+(iAmSort ? "" : " tableHeaderHidden")}>
                    <img src={ getIcon(this.props.curSortMode ? "DownArrow" : "UpArrow") } alt={"Sorting Icon"}/>
                </div>
            </div>
        </th>
    }
}

class TableHeader extends React.Component {
    render() {
        let headerData=this.props.headerData.describe();
        headerData.unshift("#");
        let headerDataIds=this.props.headerData.getids();
        headerDataIds.unshift("Num");
        let children=Array(headerData.length + 3);
        for (let i=0;i<headerData.length;i++) {
            children[i]=React.createElement(TableHeaderItem, {displayItem: headerData[i], myId: headerDataIds[i], curSortId: this.props.sortedColumn, curSortMode: this.props.sortMethodAscending, key: "HeaderItem"+headerDataIds[i], setSortMethod: this.props.setSortMethod}, null)
        }
        children[headerData.length+1]=<th key={"HeaderItemEditPlaceholder"}/>;
        children[headerData.length+2]=<th key={"HeaderItemDeletePlaceholder"}/>;
        return React.createElement('tr', {id: 'TableHeader'}, children);
    }
}

class TableRow extends React.Component {
    render() {
        let rowData=this.props.rowData;
        let children=Array(rowData.length+3);
        children[0]=<td key={"num"}>{this.props.rowNumber}</td>;
        for (let i=1;i<=rowData.length;i++) {
            children[i]=React.createElement('td', {key: this.props.rowIds[i-1]}, rowData[i-1]);
        }
        children[rowData.length+1]=<td key={"edit"}>Edit</td>;
        children[rowData.length+2]=<td key={"delete"}>Delete</td>;
        return React.createElement('tr', {className: 'TableRow'}, children);
    }
}

let mockCompData=[new componentsData(2, "why", "123", "are", "you", "42"), new componentsData(3, "i", "want", "everyone", "to", "know")];

class MainTable extends React.Component {
    tableData = mockCompData;
    render() {
        let tableElements=Array(this.tableData.length*2-1);
        let tableMultiples=this.tableData[0].getData().length;
        let tableIds=this.tableData[0].getids();
        for (let i=0;i<this.tableData.length;i++) {
            tableElements[2*i]=<TableRow rowIds={tableIds} rowData={this.tableData[i].getData()} rowNumber={i+1} key={"tableRow"+this.tableData[i].dbid}/>;
            if (i !== this.tableData.length-1) {
                tableElements[2*i+1] = <TableSeparator multiples={tableMultiples+3} key={"tableSeparator"+this.tableData[i].dbid}/>
            }
        }
        return (
            <div id="tableContainer">
                <div id="TableShadow" />
                <table id="MainTable">
                    <thead>
                        <TableHeader headerData={this.tableData[0]} sortedColumn={this.props.sortedColumn} sortMethodAscending={this.props.sortMethodAscending} setSortMethod={this.props.setSortMethod}/>
                    </thead>
                    <tbody>
                        {tableElements}
                    </tbody>
                </table>
            </div>
        )
    }
}

function getDisplayName(menuItem) {
    switch (menuItem) {
        case "components":
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

function getIcon(name) {
    switch (name) {
        case "components":
            return ComponentIcon;
        case "failures":
            return FailureIcon;
        case "modes":
            return ModeIcon;
        case "search":
            return SearchIcon;
        case "plus":
            return PlusIcon;
        case "UpArrow":
            return ArrowUp;
        case "DownArrow":
            return ArrowDown;
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

class failures {
    constructor(componentid, failmode) {

    }
}

export default App;
