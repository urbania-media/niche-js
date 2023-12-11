/* eslint-disable react/jsx-props-no-spreading */
import Dialog from '@panneau/modal-dialog';
import PropTypes from 'prop-types';
import React from 'react';

import { usePickerComponent } from '../../../contexts';

const propTypes = {
    component: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    component: null,
    value: null,
    onChange: null,
    onClose: null,
    className: null,
};

function Picker({ component, value, onChange, onClose, className }) {
    const PickerComponent = usePickerComponent(component);

    return Picker !== null ? (
        <Dialog onClose={onClose}>
            <PickerComponent value={value} onChange={onChange} className={className} />
        </Dialog>
    ) : null;
}

Picker.propTypes = propTypes;
Picker.defaultProps = defaultProps;

export default Picker;
