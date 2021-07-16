import React from 'react';
import PropTypes from 'prop-types';
import '../modal-shared/modalShared.css';
import './deleteModal.css';

export default function DeleteModal(props) {
    return (
        <div className={(props.show ? 'modal-container' : 'hide-modal-container')}>
            <div className="modal-master">
                <div className="inner-modal">
                    <div className="modal-title">Are you sure?</div>
                    <div className="modal-text">{ props.text }</div>
                    <div className="modal-buttons-container">
                        <div className="modal-buttons modal-delete-button" onClick={props.deleteClicked}>
                                Delete
                        </div>
                        <div className="modal-buttons modal-cancel-button" onClick={props.cancelClicked}>
                                Cancel
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

DeleteModal.propTypes = {
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    deleteClicked: PropTypes.func.isRequired,
    cancelClicked: PropTypes.func.isRequired,
};
