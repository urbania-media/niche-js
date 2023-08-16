import classNames from 'classnames';
import isArray from 'lodash/isArray';
import PropTypes from 'prop-types';
import React from 'react';

import { useFieldComponent } from '@niche-js/core/contexts';

import styles from './styles.module.css';

const propTypes = {
    value: PropTypes.shape({
        type: PropTypes.string,
    }),
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    onChange: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    value: null,
    fields: [],
    onChange: null,
    className: null,
};

function Settings({ value, fields, onChange, className }) {
    const Fields = useFieldComponent('fields');
    const { type = null } = value || {};
    return (
        <div className={classNames(['mw-100 p-2', { [className]: className !== null }])}>
            {type !== null ? <p className="text-capitalize mx-2">{type}</p> : null}
            {Fields !== null && fields !== null && isArray(fields) ? (
                <Fields
                    className={styles.fields}
                    fields={fields}
                    value={value}
                    onChange={onChange}
                />
            ) : null}
        </div>
    );
}

Settings.propTypes = propTypes;
Settings.defaultProps = defaultProps;

export default Settings;
