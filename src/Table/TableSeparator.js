import React from 'react';
import PropTypes from 'prop-types';

export default function TableSeparator(props) {
    const children = Array(props.multiples);
    children[0] = (
        <td key="TableSeparator0">
            <div className="tdTableSeparatorHead" />
        </td>
    );
    for (let i = 1; i < props.multiples; i++) {
        children[i] = (
            <td key={`TableSeparator${i}`}>
                <div className="tdTableSeparator" />
            </td>
        );
    }
    return React.createElement('tr', null, children);
}

TableSeparator.propTypes = {
    multiples: PropTypes.number.isRequired,
};
