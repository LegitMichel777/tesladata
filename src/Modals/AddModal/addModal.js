import React from 'react';
import PropTypes from 'prop-types';
import ModalShared from '../modal-shared/modalShared';
import '../modal-shared/modalShared.css';
import './addModal.css';
import './addModalColors.css';
import validateInput from '../../DataStructs/validateInput';

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
                            newInputIsInvalidState[i] = validateInput(currentValue, curPrototype.types[i], curPrototype.constraints[i]) !== '';
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
