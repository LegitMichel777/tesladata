import React from 'react';
import PropTypes from 'prop-types';
import './AutocompleteBox.css';

// eslint-disable-next-line no-unused-vars
export default function AutocompleteBox(props) {
    let autocompleteMainChildren = [];
    if (props.autocompleteList !== undefined) {
        for (let i = 0; i < props.autocompleteList.length; i++) {
            autocompleteMainChildren.push(
                <div className="autocomplete-element">
                    <div className="autocomplete-element-text-main">
                        {props.autocompleteList[i].main}
                    </div>
                    <div className="autocomplete-element-text-sub">
                        {props.autocompleteList[i].sub}
                    </div>
                </div>,
            );
        }
    }
    return (
        <div className="autocomplete-box">
            <input className="bordered-input-box autocomplete-box" type="text" />
            <div className="autocomplete-overlay">
                <div className="autocomplete-main">
                    { autocompleteMainChildren }
                </div>
            </div>
        </div>
    );
}

AutocompleteBox.propTypes = {
    autocompleteList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
