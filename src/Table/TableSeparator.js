import React from 'react'

export class TableSeparator extends React.Component {
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