import React from 'react';
import PropTypes from 'prop-types';
import './AutocompleteBox.css';

// eslint-disable-next-line no-unused-vars
export default class AutocompleteBox extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isFocused: false,
            boxText: "",
        };
    }

    render() {
        let autocompleteMainChildren = [];
        if (this.props.autocompleteList !== undefined) {
            for (let i = 0; i < this.props.autocompleteList.length; i++) {
                autocompleteMainChildren.push(
                    <div
                        className={`autocomplete-element${this.props.inputSelectedId === this.props.autocompleteList[i].id ? " autocomplete-element-selected" : ""}`}
                        onMouseDown={() => {
                            this.props.setInputSelectedId(this.props.autocompleteList[i].id);
                        }}
                        key={`autocomplete-element-${this.props.autocompleteList[i].id}`}
                    >
                        <div className="autocomplete-element-text-main">
                            {this.props.autocompleteList[i].main}
                        </div>
                        <div className="autocomplete-element-text-sub">
                            {this.props.autocompleteList[i].sub}
                        </div>
                    </div>,
                );
            }
        }
        return (
            <div className="autocomplete-box">
                <input
                    className={`bordered-input-box autocomplete-box${this.props.inputIsInvalid ? ' bordered-input-box-invalid' : ''}`}
                    type="text"
                    value={this.state.boxText}
                    onChange={(e) => {
                        this.setState({
                            boxText: e.target.value,
                        });
                    }}
                    onFocus={() => {
                        this.setState({
                            isFocused: true,
                        });
                    }}
                    onBlur={() => {
                        this.setState({
                            boxText: '',
                            isFocused: false,
                        });
                        if (this.props.inputSelectedId === -1) {
                            this.props.setInputInvalid(true);
                        } else {
                            this.props.setInputInvalid(false);
                        }
                    }}
                    style={{ zIndex: 2*this.props.boxRevIndex+2 }}
                />
                <div className={`bordered-input-box-preview${this.state.isFocused ? " no-show" : ""}`} style={{ zIndex: 2*this.props.boxRevIndex+2 }}>
                    <div className="bordered-input-box-preview-main">
                        { this.props.selectedInfo === undefined ? "" : this.props.selectedInfo.main }
                    </div>
                    <div className="bordered-input-box-preview-sub">
                        { this.props.selectedInfo === undefined ? "" : this.props.selectedInfo.sub }
                    </div>
                </div>
                <div className={`autocomplete-overlay${this.state.isFocused ? "" : " no-show"}`} style={{ zIndex: 2*this.props.boxRevIndex+1 }}>
                    <div className="autocomplete-main">
                        {autocompleteMainChildren}
                    </div>
                </div>
            </div>
        );
    }
}

AutocompleteBox.propTypes = {
    autocompleteList: PropTypes.arrayOf(PropTypes.object).isRequired,
    boxRevIndex: PropTypes.number.isRequired,
    inputIsInvalid: PropTypes.bool.isRequired,
    inputSelectedId: PropTypes.any.isRequired,
    setInputInvalid: PropTypes.func.isRequired,
    setInputSelectedId: PropTypes.func.isRequired,
    selectedInfo: PropTypes.object,
};
AutocompleteBox.defaultProps = {
    selectedInfo: {},
};
