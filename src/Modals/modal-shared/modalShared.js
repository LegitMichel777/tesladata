import React from 'react';
import PropTypes from 'prop-types';

export default function ModalShared(props) {
    return (
        <div className={(props.show ? 'modal-container' : 'hide-modal-container')}>
            <div className={`modal-master modal-master-${props.stylingId}`}>
                <div className={`inner-modal inner-modal-${props.stylingId}`}>
                    <div className={`modal-title modal-title-${props.stylingId}`}>{props.modalTitle}</div>
                    { props.modalBody }
                </div>
            </div>
        </div>
    );
}

ModalShared.propTypes = {
    show: PropTypes.bool.isRequired,
    modalBody: PropTypes.arrayOf(PropTypes.object).isRequired,
    stylingId: PropTypes.string.isRequired,
    modalTitle: PropTypes.string.isRequired,
};
