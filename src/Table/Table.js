import React from 'react';
import PropTypes from 'prop-types';
import TableSeparator from './TableSeparator';
import { getIcon } from '../utils';

function TableHeaderItem(props) {
    const iAmSort = props.myId === props.curSortId;
    return (
        // parameters: what to display, my id, the currently being sorted id, which way its being sorted
        <th
            onClick={() => {
                if (iAmSort) {
                    props.setSortMethod(props.myId, !props.curSortMode);
                } else {
                    props.setSortMethod(props.myId, true);
                }
            }}
            className="TableHeaderTh"
        >
            <div className={`tableHeaderItem${iAmSort ? 'Highlighted' : 'Unhighlighted'}`}>
                <div>{ props.displayItem }</div>
                <div className={`tableHeaderSort${iAmSort ? '' : ' tableHeaderHidden'}`}>
                    <img src={getIcon(props.curSortMode ? 'DownArrow' : 'UpArrow')} alt="Sorting Icon" />
                </div>
            </div>
        </th>
    );
}

TableHeaderItem.propTypes = {
    myId: PropTypes.string.isRequired,
    curSortId: PropTypes.string.isRequired,
    setSortMethod: PropTypes.func.isRequired,
    displayItem: PropTypes.string.isRequired,
    curSortMode: PropTypes.bool.isRequired,
};

function TableHeader(props) {
    const headerData = props.headerData.constructor.describe.slice();
    headerData.unshift('#');
    const headerDataIds = props.headerData.constructor.getIds.slice();
    headerDataIds.unshift('num');
    const children = Array(headerData.length + 3);
    for (let i = 0; i < headerData.length; i++) {
        children[i] = React.createElement(TableHeaderItem, {
            displayItem: headerData[i], myId: headerDataIds[i], curSortId: props.sortedColumn, curSortMode: props.sortMethodAscending, key: `HeaderItem${headerDataIds[i]}`, setSortMethod: props.setSortMethod,
        }, null);
    }
    return React.createElement('tr', { id: 'TableHeader' }, children);
}

TableHeader.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    headerData: PropTypes.object.isRequired,
    sortedColumn: PropTypes.string.isRequired,
    sortMethodAscending: PropTypes.bool.isRequired,
    setSortMethod: PropTypes.func.isRequired,
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
                                No Data
                </td>
            </tr>,
        ];
    }
    return (
        <div id="tableContainer">
            <div id="TableShadow" />
            <table id="MainTable">
                <thead>
                    <TableHeader headerData={dataPrototype} sortedColumn={props.sortedColumn} sortMethodAscending={props.sortMethodAscending} setSortMethod={props.setSortMethod} />
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
    // eslint-disable-next-line react/forbid-prop-types
    tableDataPrototype: PropTypes.object.isRequired,
    tableType: PropTypes.string.isRequired,
    processClick: PropTypes.func.isRequired,
    sortedColumn: PropTypes.string.isRequired,
    sortMethodAscending: PropTypes.bool.isRequired,
    setSortMethod: PropTypes.func.isRequired,
};
