import React from 'react';
import '../modal-shared/modalShared.css';
import './editModal.css';
import PropTypes from 'prop-types';
import ModalShared from '../modal-shared/modalShared';

export default function EditModal(props) {
    return (
        <ModalShared
            show={props.show}
            modalBody={
                [
                    <div className="modal-edit-buttons-container">
                        <div className="modal-buttons modal-edit-button" onClick={props.deleteClicked}>
                            Edit
                        </div>
                        <div className="modal-buttons modal-cancel-button" onClick={props.cancelClicked}>
                            Cancel
                        </div>
                    </div>
                ]
            }
            modalTitle="Edit Brakes"
            stylingId="edit"
        />
    );
}

EditModal.propTypes = {
    show: PropTypes.bool.isRequired,
    deleteClicked: PropTypes.func.isRequired,
    cancelClicked: PropTypes.func.isRequired,
    stylingId: PropTypes.string.isRequired
};
