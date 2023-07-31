import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

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
    const [size, setSize] = useState('normal');
    const onClick = useCallback(() => {
        setSize(size === 'normal' ? 'small' : 'normal');
    }, [size, setSize]);

    return (
        <div
            className={classNames([
                styles.preview,
                { [styles[`${size}`]]: size !== null, [className]: className !== null },
            ])}
        >
            <button type="button" className={styles.sizeButton} onClick={onClick}>
                Change size
            </button>
            <div className={styles.editor}>{children}</div>
        </div>
    );
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
