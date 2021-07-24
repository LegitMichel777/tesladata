import React from 'react';
import PropTypes from 'prop-types';
import ModalShared from '../modal-shared/modalShared';
import '../modal-shared/modalShared.css';
import './addEditModal.css';
import './addEditModalColors.css';
import '../../Shared Components/Bordered Input Box Styles/borderedInputBox.css';
import '../../Shared Components/Bordered Input Box Styles/borderedInputBoxColors.css';
import validateInput from '../../DataStructs/validateInput';
import AutocompleteBox from '../../Shared Components/Autocomplete Box/AutocompleteBox';

export default class AddEditModal extends React.Component {
    initialize(firstTime) {
        const isRootDescribe = (this.props.objectPrototype.constructor.rootDescribe !== undefined);
        let addModalFields;
        if (isRootDescribe) {
            addModalFields=this.props.objectPrototype.constructor.rootDescribe.length;
        } else {
            addModalFields=this.props.objectPrototype.constructor.describe.length;
        }
        const inputIsInvalidState = Array(addModalFields);
        let inputFieldValuesState = Array(addModalFields);
        for (let i = 0; i < addModalFields; i++) {
            inputIsInvalidState[i] = false;
            inputFieldValuesState[i] = isRootDescribe ? -1 : '';
        }
        if (this.props.modalType === 'edit' && this.props.additionalEditInfo.data !== undefined) {
            inputFieldValuesState = this.props.additionalEditInfo.data;
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
        if (prevProps.objectPrototype !== this.props.objectPrototype || prevProps.show !== this.props.show || prevProps.additionalEditInfo !== this.props.additionalEditInfo) {
            this.initialize(false);
        }
    }

    render() {
        if (this.props.modalType !== 'add' && this.props.modalType !== 'edit') {
            console.log(`Addedit called on invalid modal type ${this.props.modalType}`);
        }
        const curPrototype = this.props.objectPrototype.constructor;
        const isRootDescribe = (curPrototype.rootDescribe !== undefined);
        const addChildren = [];
        let description = (isRootDescribe ? curPrototype.rootDescribe : curPrototype.describe);
        if (this.props.show && description.length === this.state.inputFieldValues.length) {
            for (let i = 0; i < description.length; i++) {
                if (isRootDescribe) {
                    addChildren.push(
                        <div className="modal-addedit-row" key={`modal-addedit-row-${description[i]}`}>
                            <div className="modal-addedit-row-label">
                                {description[i]}
                            </div>
                            <AutocompleteBox
                                autocompleteSearch={(val) => {
                                    let translatedName;
                                    switch (curPrototype.rootTypes[i]) {
                                    case "component_pkid":
                                        translatedName = 'components';
                                        break;
                                    case 'mode_pkid':
                                        translatedName = 'modes';
                                        break;
                                    default:
                                        console.log(`Translated name requested for unknown root type ${curPrototype.rootTypes[i]}`);
                                        return [];
                                    }
                                    let sortedSearchResults = this.props.autocompleteSearch(translatedName, val);
                                    let autocompleteList = [];
                                    switch (curPrototype.rootTypes[i]) {
                                    case "component_pkid":
                                        for (let j = 0; j < sortedSearchResults.length; j++) {
                                            autocompleteList.push({
                                                main: sortedSearchResults[j].data.productname,
                                                sub: sortedSearchResults[j].data.manufacturer,
                                                id: sortedSearchResults[j].index,
                                            });
                                        }
                                        break;
                                    case 'mode_pkid':
                                        for (let j = 0; j < sortedSearchResults.length; j++) {
                                            autocompleteList.push({
                                                main: sortedSearchResults[j].data.failname,
                                                sub: sortedSearchResults[j].data.code,
                                                id: sortedSearchResults[j].index,
                                            });
                                        }
                                        break;
                                    default:
                                    }
                                    return autocompleteList;
                                }}
                                boxRevIndex={description.length - i}
                                inputIsInvalid={this.state.inputIsInvalid[i]}
                                inputSelectedId={this.state.inputFieldValues[i]}
                                setInputInvalid={(val) => {
                                    let newInputIsInvalid = this.state.inputIsInvalid.slice();
                                    newInputIsInvalid[i] = val;
                                    this.setState({
                                        inputIsInvalid: newInputIsInvalid,
                                    });
                                }}
                                setInputSelectedId={(val) => {
                                    let newInputFieldValues = this.state.inputFieldValues.slice();
                                    newInputFieldValues[i] = val;
                                    let newAutocompleteInfo;
                                    let fetchedObject;
                                    switch (curPrototype.rootTypes[i]) {
                                    case "component_pkid":
                                        fetchedObject = this.props.fetchInfoByIndex('components', val);
                                        newAutocompleteInfo = {
                                            index: val,
                                            main: fetchedObject.productname,
                                            sub: fetchedObject.manufacturer,
                                        };
                                        break;
                                    case "mode_pkid":
                                        fetchedObject = this.props.fetchInfoByIndex('modes', val);
                                        newAutocompleteInfo = {
                                            index: val,
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
                        <div className="modal-addedit-row" key={`modal-addedit-row-${description[i]}`}>
                            <div className="modal-addedit-row-label">
                                {description[i]}
                            </div>
                            <input
                                className={`bordered-input-box${this.state.inputIsInvalid[i] ? ' bordered-input-box-invalid' : ''}`}
                                type="text"
                                value={this.state.inputFieldValues[i] === null ? '' : this.state.inputFieldValues[i]}
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
        }
        let modalTitle;
        if (this.props.modalType === 'add') {
            modalTitle=`Add ${this.props.addItemDisplayTitle}`;
        } else {
            modalTitle=(
                <div>
                    {`Edit ${this.props.additionalEditInfo.name}`}
                    <div className="modal-edit-sub">
                        {this.props.additionalEditInfo.sub}
                    </div>
                </div>
            );
        }
        return (
            <ModalShared
                show={this.props.show}
                modalBody={
                    [
                        <div id="addedit-modal-create-list" key="addedit-modal-main-list">
                            {addChildren}
                        </div>,
                        <div id="addedit-modal-error-message" key="addedit-modal-error-message">{ this.state.inputInvalidMessage }</div>,
                        <div className="modal-buttons-container" key="modal-addedit-buttons-container">
                            <div
                                className={`modal-buttons modal-${this.props.modalType === 'add' ? 'add' : 'edit'}-button`}
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
                                        this.props.submitClicked(this.state.inputFieldValues);
                                    }
                                    this.setState({
                                        inputIsInvalid: newInputIsInvalidState,
                                        inputInvalidMessage: errorMessage,
                                    });
                                }}
                            >
                                {this.props.modalType === 'add' ? 'Add' : 'Edit'}
                            </div>
                            <div className="modal-buttons modal-cancel-button" onClick={this.props.cancelClicked}>
                                Cancel
                            </div>
                        </div>,
                    ]
                }
                modalTitle={modalTitle}
                stylingId="addedit"
            />
        );
    }
}

AddEditModal.propTypes = {
    modalType: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    objectPrototype: PropTypes.object.isRequired,
    addItemDisplayTitle: PropTypes.string.isRequired,
    submitClicked: PropTypes.func.isRequired,
    cancelClicked: PropTypes.func.isRequired,
    autocompleteSearch: PropTypes.func.isRequired,
    fetchInfoByIndex: PropTypes.func.isRequired,
    additionalEditInfo: PropTypes.object.isRequired,
};
