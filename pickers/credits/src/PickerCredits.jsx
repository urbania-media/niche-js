/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
    ]),
    onChange: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    value: null,
    onChange: null,
    className: null,
};

function PickerCredits({ value, onChange, className }) {
    console.log(value, onChange);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            Credits Picker
        </div>
    );
}

PickerCredits.propTypes = propTypes;
PickerCredits.defaultProps = defaultProps;

export default PickerCredits;
