import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    left: PropTypes.node,
    right: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
};

const defaultProps = {
    left: PropTypes.node,
    right: PropTypes.node,
    className: null,
    children: null,
};

function Editor({ left, right, className, children }) {
    console.log('editor', left, right, children);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <aside className={styles.left}>{left}</aside>
            <main className={styles.main}>{children}</main>
            <aside className={styles.right}>{right}</aside>
        </div>
    );
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
