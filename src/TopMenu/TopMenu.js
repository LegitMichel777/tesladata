import React from 'react'
import {getDisplayName, getIcon} from "../utils";
import './TopMenu.css'

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

export class TopMenu extends React.Component {
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