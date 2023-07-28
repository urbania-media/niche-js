import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    value: PropTypes.shape({}),
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    onChange: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    value: null,
    fields: null,
    onChange: null,
    className: null,
    children: null,
};

function Preview({ value, fields, onChange, className, children }) {
    return (
        <div className={classNames([styles.preview, { [className]: className !== null }])}>
            Sizes
            <div className={styles.editor}>{children}</div>
        </div>
    );
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
