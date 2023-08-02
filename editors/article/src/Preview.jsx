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
    const onClickSize = useCallback(() => {
        setSize(size === 'normal' ? 'small' : 'normal');
    }, [size, setSize]);

    const [theme, setTheme] = useState('urbania');
    const onClickTheme = useCallback(() => {
        setTheme(theme === 'urbania' ? 'quatre95' : 'urbania');
    }, [theme, setTheme]);

    return (
        <div
            className={classNames([
                styles.preview,
                {
                    [styles[`${size}`]]: size !== null,
                    [styles[`${theme}`]]: theme !== null,
                    [className]: className !== null,
                },
            ])}
        >
            <button type="button" className={styles.sizeButton} onClick={onClickSize}>
                Change size: {size}
            </button>
            <button type="button" className={styles.sizeButton} onClick={onClickTheme}>
                Change theme: {theme}
            </button>
            <div className={styles.editor}>{children}</div>
        </div>
    );
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
