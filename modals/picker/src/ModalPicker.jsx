/* eslint-disable react/jsx-props-no-spreading */
import Dialog from '@panneau/modal-dialog';
import PropTypes from 'prop-types';
import React from 'react';

import { usePickerComponent } from '@niche-js/core/contexts';

const propTypes = {
    component: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.shape({}),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    component: null,
    title: null,
    value: null,
    onChange: null,
    onClose: null,
    className: null,
};

const ModalPicker = ({ component, title, value, onChange, onClose, className, ...props }) => {
    const PickerComponent = usePickerComponent(component);
    return (
        <Dialog title={title} size="md" onClose={onClose} className={className}>
            {PickerComponent !== null ? (
                <PickerComponent value={value} onChange={onChange} onClose={onClose} {...props} />
            ) : null}
        </Dialog>
    );
};

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;

export default ModalPicker;
