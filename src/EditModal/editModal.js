import React from "react";
import '../modal-shared/modalShared.css'
import './deleteModal.css'

export class EditModal extends React.Component {
    render() {
        return (
            <div className={(this.props.show ? "modal-container" : "hide-modal-container")}>
                <div className={"modal-master"}>
                    <div className={"inner-modal"}>
                        <div className={"modal-title"}>Edit Brakes</div>
                        <div className={"modal-buttons-container"}>
                            <div className={"modal-buttons modal-edit-button"} onClick={this.props.deleteClicked}>
                                Edit
                            </div>
                            <div className={"modal-buttons modal-cancel-button"} onClick={this.props.cancelClicked}>
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}