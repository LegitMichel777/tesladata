import React from 'react';
import PropTypes from 'prop-types';
import { getDisplayName, getIcon } from '../utils';
import './TopMenu.css';

function SearchField(props) {
    return (
        <div id="mainSearchField">
            <img id="searchIcon" src={getIcon('search')} alt="Search Icon" />
            <input type="text" className="beautiful-textfield" placeholder={`Search ${getDisplayName(props.currentSelectedMenuItem)}`} />
        </div>
    );
}

SearchField.propTypes = {
    currentSelectedMenuItem: PropTypes.string.isRequired,
};

function TopMenuButton(props) {
    return (
        <div className={`topMenuButtonCircle ${props.disabled ? 'topMenuButtonCircleDisabled' : 'topMenuButtonCircleEnabled'}`} onClick={props.onClick}>
            <div className="topMenuButtonInnerCircle">
                <img className={`topMenuButtonIcon${props.disabled ? ' topMenuButtonIconDisabled' : ''}`} id={props.imgId} src={getIcon(props.iconName)} alt={props.alt} />
            </div>
        </div>
    );
}

TopMenuButton.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    imgId: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

function MenuItem(props) {
    const myItemSelected = props.myMenuItem === props.currentSelectedMenuItem;
    return (
        <div className={`segmentedControlOption segmentedControlOption${myItemSelected ? 'Selected' : 'Deselected'}`} onClick={props.onClick}>
            <div className={`segmentedControlImageWrapper ${myItemSelected ? 'segmentedItemSelected' : 'segmentedItemDeselected'}`}>
                <img className="segmentedControlIcon" src={getIcon(props.myMenuItem)} alt={getDisplayName(props.myMenuItem)} />
            </div>
        </div>
    );
}

MenuItem.propTypes = {
    myMenuItem: PropTypes.string.isRequired,
    currentSelectedMenuItem: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default class TopMenu extends React.Component {
    handleMenuPress(menuItem) {
        this.props.setSelectedMenuItem(menuItem);
    }

    render() {
        return (
            <div id="topMenu">
                <div id="topMenuMainSection">
                    <div className="topSegEqual" id="buttonsBar">
                        <TopMenuButton
                            iconName="edit"
                            alt="Edit"
                            imgId="editIcon"
                            disabled={!this.props.editEnabled}
                            onClick={() => {

                            }}
                        />
                        <TopMenuButton
                            iconName="delete"
                            alt="Delete"
                            imgId="deleteIcon"
                            disabled={!this.props.deleteEnabled}
                            onClick={() => {
                                this.props.performDelete();
                            }}
                        />
                        <TopMenuButton
                            iconName="plus"
                            alt="Add"
                            imgId="plusIcon"
                            disabled={false}
                            onClick={() => {
                                this.props.performAdd();
                            }}
                        />
                    </div>
                    <div id="mainSegmentedControl">
                        <MenuItem
                            currentSelectedMenuItem={this.props.currentSelectedMenuItem}
                            myMenuItem="components"
                            onClick={() => this.handleMenuPress('components')}
                        />
                        <MenuItem
                            currentSelectedMenuItem={this.props.currentSelectedMenuItem}
                            myMenuItem="failures"
                            onClick={() => this.handleMenuPress('failures')}
                        />
                        <MenuItem
                            currentSelectedMenuItem={this.props.currentSelectedMenuItem}
                            myMenuItem="modes"
                            onClick={() => this.handleMenuPress('modes')}
                        />
                    </div>
                    <div className="topSegEqual">
                        <SearchField currentSelectedMenuItem={this.props.currentSelectedMenuItem} />
                    </div>
                </div>
                <div id="topMenuSelectedDisplay">
                    { getDisplayName(this.props.currentSelectedMenuItem) }
                </div>
            </div>
        );
    }
}

TopMenu.propTypes = {
    setSelectedMenuItem: PropTypes.func.isRequired,
    editEnabled: PropTypes.bool.isRequired,
    deleteEnabled: PropTypes.bool.isRequired,
    performDelete: PropTypes.func.isRequired,
    performAdd: PropTypes.func.isRequired,
    currentSelectedMenuItem: PropTypes.string.isRequired,
};
