import React from "react";
import './deleteModal.css'

export class DeleteModal extends React.Component {
    render() {
        return (
            <div id={(this.props.show ? "modal-container" : "hide-modal-container")}>
                <div id={"modal-master"}>
                    <div id={"inner-modal"}>
                        <div id={"modal-title"}>Are you sure?</div>
                        <div id={"modal-text"}>{ this.props.text }</div>
                        <div id={"modal-buttons-container"}>
                            <div className={"modal-buttons"} id={"modal-delete-button"} onClick={this.props.deleteClicked}>
                                Delete
                            </div>
                            <div className={"modal-buttons"} id={"modal-cancel-button"} onClick={this.props.cancelClicked}>
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}