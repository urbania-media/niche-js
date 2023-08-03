import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import styles from '../../styles/editor/preview.module.css';

const propTypes = {
    destinations: PropTypes.arrayOf(PropTypes.shape({})),
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    destinations: null,
    className: null,
    children: null,
};

function Preview({ destinations, className, children }) {
    // const [size, setSize] = useState('normal');
    // const onClickSize = useCallback(() => {
    //     setSize(size === 'normal' ? 'small' : 'normal');
    // }, [size, setSize]);

    // const [theme, setTheme] = useState('urbania');
    // const onClickTheme = useCallback(() => {
    //     setTheme(theme === 'urbania' ? 'quatre95' : 'urbania');
    // }, [theme, setTheme]);

    return (
        <div
            className={classNames([
                styles.container,
                {
                    // [styles[`${size}`]]: size !== null,
                    [className]: className !== null,
                },
            ])}
        >
            <div className="mb-1">
                <button type="button" className="btn btn-primary">
                    Change size
                </button>
                <button type="button" className="btn btn-secondary">
                    Change theme
                </button>
            </div>
            <div className={styles.editor}>{children}</div>
        </div>
    );
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
