import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Preview from './Preview';

import styles from '../../styles/editor/editor.module.css';

const propTypes = {
    left: PropTypes.node,
    right: PropTypes.node,
    preview: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
};

const defaultProps = {
    left: null,
    right: null,
    preview: true,
    className: null,
    children: null,
};

function Editor({ left, right, preview, className, children }) {
    // console.log('editor render', left, right, children);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {left !== null ? <aside className={styles.left}>{left}</aside> : null}
            <main className={styles.main}>
                {preview ? <Preview>{children}</Preview> : children}
            </main>
            {right !== null ? <aside className={styles.right}>{right}</aside> : null}
        </div>
    );
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
