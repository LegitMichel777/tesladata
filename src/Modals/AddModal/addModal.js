import React from 'react';
import PropTypes from 'prop-types';
import ModalShared from '../modal-shared/modalShared';
import '../modal-shared/modalShared.css';
import './addModal.css';
import './addModalColors.css';
import '../../Shared Components/Bordered Input Box Styles/borderedInputBox.css';
import '../../Shared Components/Bordered Input Box Styles/borderedInputBoxColors.css';
import validateInput from '../../DataStructs/validateInput';
import AutocompleteBox from '../../Shared Components/Autocomplete Ribbon/AutocompleteBox';

export default class AddModal extends React.Component {
    initialize(firstTime) {
        const isRootDescribe = (this.props.objectPrototype.constructor.rootDescribe !== undefined);
        let addModalFields;
        if (isRootDescribe) {
            addModalFields=this.props.objectPrototype.constructor.rootDescribe.length;
        } else {
            addModalFields=this.props.objectPrototype.constructor.describe.length;
        }
        const inputIsInvalidState = Array(addModalFields);
        const inputFieldValuesState = Array(addModalFields);
        for (let i = 0; i < addModalFields; i++) {
            inputIsInvalidState[i] = false;
            inputFieldValuesState[i] = isRootDescribe ? -1 : '';
        }
        if (firstTime) {
            this.state = {
                inputIsInvalid: inputIsInvalidState,
                inputFieldValues: inputFieldValuesState,
                inputInvalidMessage: '',
                autocompleteSelectedInfo: [],
            };
        } else {
            this.setState({
                inputIsInvalid: inputIsInvalidState,
                inputFieldValues: inputFieldValuesState,
                inputInvalidMessage: '',
                autocompleteSelectedInfo: [],
            });
        }
    }

    constructor(props) {
        super(props);
        // state the addModal has to keep track of: whether or not an input box is red
        this.initialize(true);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.show !== this.props.show) {
            this.initialize(false);
        }
    }

    render() {
        const curPrototype = this.props.objectPrototype.constructor;
        const isRootDescribe = (curPrototype.rootDescribe !== undefined);
        const addChildren = [];
        let description = (isRootDescribe ? curPrototype.rootDescribe : curPrototype.describe);
        for (let i = 0; i < description.length; i++) {
            if (isRootDescribe) {
                addChildren.push(
                    <div className="modal-add-row" key={`modal-add-row-${description[i]}`}>
                        <div className="modal-add-row-label">
                            {description[i]}
                        </div>
                        <AutocompleteBox
                            autocompleteList={this.props.autocompleteList[i]}
                            autocompleteSearch={this.props.autocompleteSearch}
                            boxRevIndex={description.length-i}
                            inputIsInvalid={this.state.inputIsInvalid[i]}
                            inputSelectedId={this.state.inputFieldValues[i]}
                            setInputInvalid={(val) => {
                                let newInputIsInvalid = this.state.inputIsInvalid.slice();
                                newInputIsInvalid[i]=val;
                                this.setState({
                                    inputIsInvalid: newInputIsInvalid,
                                });
                            }}
                            setInputSelectedId={(val) => {
                                let newInputFieldValues = this.state.inputFieldValues.slice();
                                newInputFieldValues[i]=val;
                                let newAutocompleteInfo;
                                let fetchedObject;
                                switch (curPrototype.rootTypes[i]) {
                                case "component_pkid":
                                    fetchedObject = this.props.fetchInfoByIndex('components', val);
                                    newAutocompleteInfo = {
                                        main: fetchedObject.productname,
                                        sub: fetchedObject.manufacturer,
                                    };
                                    break;
                                case "mode_pkid":
                                    fetchedObject = this.props.fetchInfoByIndex('modes', val);
                                    newAutocompleteInfo = {
                                        main: fetchedObject.failname,
                                        sub: fetchedObject.code,
                                    };
                                    break;
                                default:
                                    console.log(`Unrecognized root type ${curPrototype.rootTypes}`);
                                }
                                let newAutocompleteSelectedInfo = this.state.autocompleteSelectedInfo.slice();
                                newAutocompleteSelectedInfo[i] = newAutocompleteInfo;
                                this.setState({
                                    inputFieldValues: newInputFieldValues,
                                    autocompleteSelectedInfo: newAutocompleteSelectedInfo,
                                });
                            }}
                            selectedInfo={this.state.autocompleteSelectedInfo[i]}
                        />
                    </div>,
                );
            } else {
                addChildren.push(
                    <div className="modal-add-row" key={`modal-add-row-${description[i]}`}>
                        <div className="modal-add-row-label">
                            {description[i]}
                        </div>
                        <input
                            className={`bordered-input-box${this.state.inputIsInvalid[i] ? ' bordered-input-box-invalid' : ''}`}
                            type="text"
                            value={this.state.inputFieldValues[i]}
                            onChange={(val) => {
                                const newState = this.state.inputFieldValues.slice();
                                newState[i] = val.target.value;
                                this.setState({
                                    inputFieldValues: newState,
                                });
                            }}
                            onBlur={(e) => {
                                const currentValue = e.target.value;
                                const newInputIsInvalidState = this.state.inputIsInvalid.slice();
                                newInputIsInvalidState[i] = validateInput(currentValue, curPrototype.types[i], curPrototype.constraints[i]) !== '';
                                this.setState({
                                    inputIsInvalid: newInputIsInvalidState,
                                });
                            }}
                        />
                    </div>,
                );
            }
        }
        return (
            <ModalShared
                show={this.props.show}
                modalBody={
                    [
                        <div id="add-modal-create-list" key="add-modal-main-list">
                            {addChildren}
                        </div>,
                        <div id="add-modal-error-message" key="add-modal-error-message">{ this.state.inputInvalidMessage }</div>,
                        <div className="modal-buttons-container" key="modal-add-buttons-container">
                            <div
                                className="modal-buttons modal-add-button"
                                onClick={() => {
                                    let encounteredError = false;
                                    let errorMessage = '';
                                    const newInputIsInvalidState = Array(isRootDescribe ? curPrototype.rootDescribe.length : curPrototype.describe.length);
                                    for (let i = 0; i < curPrototype.describe.length; i++) {
                                        let validationResult;
                                        if (isRootDescribe) {
                                            validationResult = (this.state.inputFieldValues[i] === -1 ? 'Cannot be empty' : '');
                                        } else {
                                            validationResult = validateInput(this.state.inputFieldValues[i], curPrototype.types[i], curPrototype.constraints[i]);
                                        }
                                        if (validationResult !== '' && !encounteredError) {
                                            encounteredError = true;
                                            errorMessage = `Invalid ${curPrototype.describe[i]}: ${validationResult}`;
                                        }
                                        newInputIsInvalidState[i] = (validationResult !== '');
                                    }
                                    if (!encounteredError) {
                                        this.props.addClicked(this.state.inputFieldValues);
                                    }
                                    this.setState({
                                        inputIsInvalid: newInputIsInvalidState,
                                        inputInvalidMessage: errorMessage,
                                    });
                                }}
                            >
                                Add
                            </div>
                            <div className="modal-buttons modal-cancel-button" onClick={this.props.cancelClicked}>
                                Cancel
                            </div>
                        </div>,
                    ]
                }
                modalTitle={`Add ${this.props.addItemDisplayTitle}`}
                stylingId="add"
            />
        );
    }
}

AddModal.propTypes = {
    show: PropTypes.bool.isRequired,
    objectPrototype: PropTypes.object.isRequired,
    addItemDisplayTitle: PropTypes.string.isRequired,
    addClicked: PropTypes.func.isRequired,
    cancelClicked: PropTypes.func.isRequired,
    autocompleteList: PropTypes.array.isRequired,
    autocompleteSearch: PropTypes.func.isRequired,
    fetchInfoByIndex: PropTypes.func.isRequired,
};
