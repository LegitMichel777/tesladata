import React from 'react';
import PropTypes from 'prop-types';
import TableSeparator from './TableSeparator';
import { getIcon } from '../utils';
import './TableColors.css';

function TableHeaderItem(props) {
    return (
        // parameters: what to display, my id, the currently being sorted id, which way its being sorted
        <th
            onMouseDown={(e) => {
                e.preventDefault();
                props.handleHeaderClick(e.metaKey || e.altKey);
            }}
            className="TableHeaderTh"
        >
            <div className={`tableHeaderItem${props.highlight ? 'Highlighted' : 'Unhighlighted'}`}>
                <div className={props.greyOut ? 'tableHeaderItem-greyOut' : ''}>{ props.displayItem }</div>
                <div className={`tableHeaderSort${props.sortArrow!=='' ? '' : ' tableHeaderHidden'}`}>
                    <img src={getIcon(props.sortArrow)} className="tableHeaderSort-icon" alt="Sorting Icon" />
                </div>
            </div>
        </th>
    );
}

TableHeaderItem.propTypes = {
    displayItem: PropTypes.string.isRequired,
    highlight: PropTypes.bool.isRequired,
    greyOut: PropTypes.bool.isRequired,
    sortArrow: PropTypes.string.isRequired,
    handleHeaderClick: PropTypes.func.isRequired,
};

function TableHeader(props) {
    const headerData = props.headerData.constructor.describe.slice();
    headerData.unshift('#');
    const headerDataIds = props.headerData.constructor.getIds.slice();
    headerDataIds.unshift('num');
    const children = Array(headerData.length + 3);
    for (let i = 0; i < headerData.length; i++) {
        children[i] = React.createElement(TableHeaderItem, {
            displayItem: headerData[i],
            highlight: headerDataIds[i] === props.sortedColumn,
            greyOut: props.isInSearch && props.searchColumn !== headerDataIds[i],
            sortArrow: headerDataIds[i] === props.sortedColumn ? (props.sortMethodAscending ? 'DownArrow' : 'UpArrow') : '',
            handleHeaderClick: (cmdOrOptionHeld) => {
                props.handleHeaderClick(headerDataIds[i], cmdOrOptionHeld);
            },
            key: `HeaderItem${headerDataIds[i]}`,
        }, null);
    }
    return React.createElement('tr', { id: 'TableHeader' }, children);
}

TableHeader.propTypes = {
    headerData: PropTypes.object.isRequired,
    sortedColumn: PropTypes.string.isRequired,
    sortMethodAscending: PropTypes.bool.isRequired,
    handleHeaderClick: PropTypes.func.isRequired,
    isInSearch: PropTypes.bool.isRequired,
    searchColumn: PropTypes.string.isRequired,
};

function TableRow(props) {
    const { rowData } = props;
    const children = Array(rowData.length + 3);
    children[0] = <td key="num" className={(props.rowHighlighted ? 'TableRowHighlighted' : '')}>{props.rowNumber}</td>;
    for (let i = 1; i <= rowData.length; i++) {
        children[i] = (
            <td key={props.rowIds[i - 1]} className={(props.rowHighlighted ? 'TableRowHighlighted' : '')}>
                {rowData[i - 1]}
            </td>
        );
    }
    return (
        <tr
            className="TableRow"
            onClick={(e) => {
                let typeOfAction = 'single';
                if (e.shiftKey) {
                    typeOfAction = 'range';
                } else if (e.metaKey || e.altKey) {
                    typeOfAction = 'multi';
                }
                props.processClick(props.rowSelectIdentifier, typeOfAction);
            }}
        >
            {children}
        </tr>
    );
    /*
    There are two parts to a rowSelectIdentifier. The type of table (Components, Failures, Modes, etc.) and the dbid (primary key)
    */
}

TableRow.propTypes = {
    rowData: PropTypes.arrayOf(PropTypes.string).isRequired,
    rowHighlighted: PropTypes.bool.isRequired,
    rowNumber: PropTypes.number.isRequired,
    rowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    processClick: PropTypes.func.isRequired,
    rowSelectIdentifier: PropTypes.shape({
        tableType: PropTypes.string,
        tableIndex: PropTypes.number,
    }).isRequired,
};

export default function MainTable(props) {
    const tableData = props.displayData;
    const dataPrototype = props.tableDataPrototype;
    let tableElements = Array(Math.max(tableData.length * 2 - 1, 0));
    if (tableData.length > 0) {
        const tableMultiples = dataPrototype.getData().length;
        const tableIds = dataPrototype.constructor.getIds;
        for (let i = 0; i < tableData.length; i++) {
            tableElements[2 * i] = (
                <TableRow
                    rowIds={tableIds}
                    rowData={tableData[i].getData()}
                    rowNumber={tableData[i].num}
                    key={`tableRow${props.tableType}${tableData[i].dbid}`}
                    rowHighlighted={tableData[i].selected}
                    rowSelectIdentifier={{
                        tableType: props.tableType,
                        tableIndex: i,
                    }}
                    processClick={props.processClick}
                />
            );
            if (i !== tableData.length - 1) {
                tableElements[2 * i + 1] = <TableSeparator multiples={tableMultiples + 3} key={`tableSeparator${tableData[i].dbid}`} />;
            }
        }
    } else {
        tableElements = [
            <tr key="NoDataTableTr">
                <td id="NoData" colSpan={dataPrototype.getData().length + 1}>
                    {props.isInSearch ? "No Results" : "No Data"}
                </td>
            </tr>,
        ];
    }
    return (
        <div id="tableContainer">
            <div id="TableShadow" />
            <table id="MainTable">
                <thead>
                    <TableHeader headerData={dataPrototype} sortedColumn={props.sortedColumn} sortMethodAscending={props.sortMethodAscending} handleHeaderClick={props.handleHeaderClick} isInSearch={props.isInSearch} searchColumn={props.searchColumn} />
                </thead>
                <tbody>
                    {tableElements}
                </tbody>
            </table>
        </div>
    );
}

MainTable.propTypes = {
    displayData: PropTypes.arrayOf(PropTypes.object).isRequired,
    tableDataPrototype: PropTypes.object.isRequired,
    tableType: PropTypes.string.isRequired,
    processClick: PropTypes.func.isRequired,
    sortedColumn: PropTypes.string.isRequired,
    sortMethodAscending: PropTypes.bool.isRequired,
    handleHeaderClick: PropTypes.func.isRequired,
    isInSearch: PropTypes.bool.isRequired,
    searchColumn: PropTypes.string.isRequired,
};
