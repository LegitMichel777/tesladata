import React from 'react';
import PropTypes from 'prop-types';
import ModalShared from '../modal-shared/modalShared';
import '../modal-shared/modalShared.css';
import './deleteModal.css';

export default function DeleteModal(props) {
    return (
        <ModalShared
            show={props.show}
            modalBody={
                [
                    <div className="modal-text" key="modal-delete-main-text">{ props.text }</div>,
                    <div className="modal-buttons-container" key="modal-delete-buttons-container">
                        <div className="modal-buttons modal-delete-button" onClick={props.deleteClicked}>
                            Delete
                        </div>
                        <div className="modal-buttons modal-cancel-button" onClick={props.cancelClicked}>
                            Cancel
                        </div>
                    </div>,
                ]
            }
            modalTitle="Are you sure?"
            stylingId="delete"
        />
    );
}

DeleteModal.propTypes = {
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    deleteClicked: PropTypes.func.isRequired,
    cancelClicked: PropTypes.func.isRequired,
};
