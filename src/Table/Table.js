import React from "react";
import {TableSeparator} from './TableSeparator'
import {getIcon} from '../utils'

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
        let headerDataIds=this.props.headerData.getIds();
        headerDataIds.unshift("num");
        let children=Array(headerData.length + 3);
        for (let i=0;i<headerData.length;i++) {
            children[i]=React.createElement(TableHeaderItem, {displayItem: headerData[i], myId: headerDataIds[i], curSortId: this.props.sortedColumn, curSortMode: this.props.sortMethodAscending, key: "HeaderItem"+headerDataIds[i], setSortMethod: this.props.setSortMethod}, null)
        }
        return React.createElement('tr', {id: 'TableHeader'}, children);
    }
}

class TableRow extends React.Component {
    render() {
        let rowData=this.props.rowData;
        let children=Array(rowData.length+3);
        children[0]=<td key={"num"} className={(this.props.rowHighlighted ? "TableRowHighlighted" : "")}>{this.props.rowNumber}</td>;
        for (let i=1;i<=rowData.length;i++) {
            children[i]=React.createElement('td', {key: this.props.rowIds[i-1], className: (this.props.rowHighlighted ? "TableRowHighlighted" : "")}, rowData[i-1]);
        }
        return <tr className={'TableRow'} onClick={(e) => {
            let typeOfAction="single";
            if (e.shiftKey) {
                typeOfAction="range";
            } else {
                if (e.metaKey || e.altKey) {
                    typeOfAction="multi";
                }
            }
            this.props.processClick(this.props.rowSelectIdentifier, typeOfAction);
        }}>
            {children}
        </tr>;
        /*
        There are two parts to a rowSelectIdentifier. The type of table (Components, Failures, Modes, etc.) and the dbid (primary key)
         */
    }
}

export class MainTable extends React.Component {
    render() {
        let tableData = this.props.displayData;
        let tableElements = Array(Math.max(tableData.length * 2 - 1, 0));
        if (tableData.length > 0) {
            let tableMultiples = tableData[0].getData().length;
            let tableIds = tableData[0].getIds();
            for (let i = 0; i < tableData.length; i++) {
                tableElements[2 * i] =
                    <TableRow rowIds={tableIds} rowData={tableData[i].getData()} rowNumber={tableData[i].num}
                                                 key={"tableRow" + this.props.tableType + tableData[i].dbid}
                                                 rowHighlighted={tableData[i].selected}
                              rowSelectIdentifier={{
                                  tableType: this.props.tableType,
                                  tableIndex: i
                              }
                              }
                              processClick={this.props.processClick}
                />;
                if (i !== tableData.length - 1) {
                    tableElements[2 * i + 1] =
                        <TableSeparator multiples={tableMultiples + 3} key={"tableSeparator" + tableData[i].dbid}/>
                }
            }
            return (
                <div id="tableContainer">
                    <div id="TableShadow" />
                    <table id="MainTable">
                        <thead>
                        <TableHeader headerData={tableData[0]} sortedColumn={this.props.sortedColumn} sortMethodAscending={this.props.sortMethodAscending} setSortMethod={this.props.setSortMethod}/>
                        </thead>
                        <tbody>
                        {tableElements}
                        </tbody>
                    </table>
                </div>
            )
        }
        return (
            <div id="NoData">
                No Data
            </div>
        )
    }
}