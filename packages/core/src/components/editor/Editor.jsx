import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Preview from './Preview';

import styles from '../../styles/editor/editor.module.css';

const propTypes = {
    platformId: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.shape({})),
    onPlatformChange: PropTypes.func,
    outline: PropTypes.node,
    settings: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
};

const defaultProps = {
    platformId: null,
    platforms: null,
    onPlatformChange: null,
    outline: null,
    settings: null,
    className: null,
    children: null,
};

function Editor({
    platformId,
    platforms,
    onPlatformChange,
    outline,
    settings,
    className,
    children,
}) {
    return (
        <div
            className={classNames([
                'd-flex',
                'w-100',
                styles.container,
                { [className]: className !== null },
            ])}
        >
            <aside className={classNames(['bg-light', styles.outline])}>{outline}</aside>
            <main className={classNames(['flex-grow-1', styles.main])}>
                <Preview
                    platforms={platforms}
                    platformId={platformId}
                    onPlatformChange={onPlatformChange}
                >
                    {children}
                </Preview>
            </main>
            <aside className={classNames(['bg-light', styles.settings])}>{settings}</aside>
        </div>
    );
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
