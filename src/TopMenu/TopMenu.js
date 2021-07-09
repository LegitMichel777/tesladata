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

class TopMenuButton extends React.Component {
    render() {
        return (
            <div className={"topMenuButtonCircle "+(this.props.disabled ? "topMenuButtonCircleDisabled" : "topMenuButtonCircleEnabled")} onClick={ this.props.onClick }>
                <div className="topMenuButtonInnerCircle">
                    <img className={"topMenuButtonIcon"+(this.props.disabled ? " topMenuButtonIconDisabled" : "")} id={this.props.imgId} src={ getIcon(this.props.iconName) } alt={this.props.alt} />
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
                    <div className="topSegEqual" id={"buttonsBar"}>
                        <TopMenuButton iconName={"edit"} alt={"Edit"} imgId={"editIcon"} disabled={!this.props.editEnabled} onClick={() => {

                        }}/>
                        <TopMenuButton iconName={"delete"} alt={"Delete"} imgId={"deleteIcon"} disabled={!this.props.deleteEnabled} onClick={() => {
                            this.props.performDelete();
                        }}/>
                        <TopMenuButton iconName={"plus"} alt={"Add"} imgId={"plusIcon"} disabled={false} onClick={() => {
                            console.log("Not implemented yet");
                        }}/>
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