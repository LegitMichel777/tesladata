import React from 'react';
import PropTypes from 'prop-types';
import ModalShared from '../modal-shared/modalShared';
import '../modal-shared/modalShared.css';
import './addModal.css';

function cleanseInput(x) {
    if (x.length === 0) {
        return x;
    }
    let rturn = x;
    if (rturn[0] === ' ') {
        rturn = rturn.substring(1);
    }
    if (rturn.length === 0) {
        return rturn;
    }
    if (rturn[rturn.length - 1] === ' ') {
        rturn = rturn.substring(0, rturn.length - 1);
    }
    return rturn;
}

function validateInput(input, type, requirements) { // return error if there is, return blank for no error
    let cleanedInput = cleanseInput(input);
    console.log(requirements);
    if (requirements.canBeEmpty !== undefined && !requirements.canBeEmpty && cleanedInput === '') {
        return 'Cannot be empty';
    }
    console.log(type);
    if (type === 'number') {
        console.log('I got myself a number');
        console.log(cleanedInput);
        if (isNaN(cleanedInput)) {
            console.log('wtf');
            return 'Must be a number';
        }
        cleanedInput = Number.parseFloat(cleanedInput);
        let requirementsDescription = '';
        let passesInputValidation = true;
        if (requirements.moreThanOrEqualTo !== undefined) {
            requirementsDescription = `Must be more than or equal to ${requirements.moreThanOrEqualTo}`;
            if (cleanedInput < requirements.moreThanOrEqualTo) {
                passesInputValidation = false;
            }
        } else if (requirements.moreThan !== undefined) {
            requirementsDescription = `Must be more than ${requirements.moreThan}`;
            if (cleanedInput <= requirements.moreThan) {
                passesInputValidation = false;
            }
        }

        if (requirements.lessThanOrEqualTo !== undefined) {
            if (requirementsDescription === '') {
                requirementsDescription = `Must be more than or equal to ${requirements.moreThanOrEqualTo}`;
            } else {
                requirementsDescription = `${requirementsDescription} and less than or equal to ${requirements.lessThanOrEqualTo}`;
            }
            if (cleanedInput > requirements.lessThanOrEqualTo) {
                passesInputValidation = false;
            }
        } else if (requirements.lessThan !== undefined) {
            if (requirementsDescription === '') {
                requirementsDescription = `Must be more than ${requirements.moreThanOrEqualTo}`;
            } else {
                requirementsDescription = `${requirementsDescription} and less than ${requirements.lessThan}`;
            }
            if (cleanedInput >= requirements.lessThan) {
                passesInputValidation = false;
            }
        }

        if (passesInputValidation) {
            return '';
        }
        return requirementsDescription;
    }
    if (type === 'string') {
        // nothing yet
        return '';
    }
    return '';
}

export default class AddModal extends React.Component {
    initialize(firstTime) {
        const inputIsInvalidStateLength = this.props.objectPrototype.constructor.describe.length;
        const inputIsInvalidState = Array(inputIsInvalidStateLength);
        const inputFieldValuesState = Array(inputIsInvalidStateLength);
        for (let i = 0; i < inputIsInvalidStateLength; i++) {
            inputIsInvalidState[i] = false;
            inputFieldValuesState[i] = '';
        }
        if (firstTime) {
            this.state = {
                inputIsInvalid: inputIsInvalidState,
                inputFieldValues: inputFieldValuesState,
                inputInvalidMessage: '',
            };
        } else {
            this.setState({
                inputIsInvalid: inputIsInvalidState,
                inputFieldValues: inputFieldValuesState,
                inputInvalidMessage: '',
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
        const addChildren = [];
        const curPrototype = this.props.objectPrototype.constructor;
        for (let i = 0; i < curPrototype.describe.length; i++) {
            addChildren.push(
                <div className="modal-add-row" key={`modal-add-row-${curPrototype.describe[i]}`}>
                    <div className="modal-add-row-label">
                        {curPrototype.describe[i]}
                    </div>
                    <input
                        className={`modal-add-row-input${this.state.inputIsInvalid[i] ? ' modal-add-row-input-invalid' : ''}`}
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
                            console.log(curPrototype.constraints, i);
                            if (validateInput(currentValue, curPrototype.types[i], curPrototype.constraints[i]) === '') {
                                newInputIsInvalidState[i] = false;
                            } else {
                                newInputIsInvalidState[i] = true;
                            }
                            this.setState({
                                inputIsInvalid: newInputIsInvalidState,
                            });
                        }}
                    />
                </div>,
            );
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
                                    const newInputIsInvalidState = Array(curPrototype.length);
                                    for (let i = 0; i < curPrototype.describe.length; i++) {
                                        const validationResult = validateInput(this.state.inputFieldValues[i], curPrototype.types[i], curPrototype.constraints[i]);
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
};
