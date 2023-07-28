import { useFieldComponent } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    value: PropTypes.shape({}),
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    onChange: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    value: null,
    fields: null,
    onChange: null,
    className: null,
};

function Settings({ value, fields, onChange, className }) {
    const Fields = useFieldComponent('fields');
    return (
        <div className={classNames([styles.settings, { [className]: className !== null }])}>
            <Fields className={styles.fields} fields={fields} value={value} onChange={onChange} />
        </div>
    );
}

Settings.propTypes = propTypes;
Settings.defaultProps = defaultProps;

export default Settings;
