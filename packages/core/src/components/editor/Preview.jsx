import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import useFullscreen from '../../hooks/useFullscreen';

import styles from '../../styles/editor/preview.module.css';

const propTypes = {
    platforms: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        }),
    ),
    platformId: PropTypes.string,
    onPlatformChange: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    platforms: [
        { id: 'urbania_ca', name: 'urbania.ca' },
        { id: 'urbania_fr', name: 'urbania.fr' },
    ],
    platformId: null,
    onPlatformChange: null,
    className: null,
    children: null,
};

function Preview({ platforms, platformId, onPlatformChange, className, children }) {
    const body = useMemo(() => {
        window.document.querySelector('body');
    }, []);
    const { toggle: toggleFullscreen, active: fullscreen = false } = useFullscreen(body);
    const platform = (platforms || []).find(({ id = null }) => id === platformId) || null;

    const [size, setSize] = useState('desktop');
    const onClickSize = useCallback(
        (newSize) => {
            setSize(newSize);
        },
        [setSize],
    );

    const [open, setOpen] = useState(false);
    const toggleOpen = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    const onClickPlatform = useCallback(
        (newPlatform) => {
            if (onPlatformChange !== null) {
                onPlatformChange(newPlatform);
            }
            setOpen(false);
        },
        [onPlatformChange],
    );

    const { label: platformName } = platform || {};

    return (
        <div
            className={classNames([
                styles.container,
                {
                    [styles[`${size}`]]: size !== null,
                    [styles.fullscreen]: fullscreen,
                    [className]: className !== null,
                },
            ])}
        >
            <div className="d-flex mb-2">
                <div className="dropdown">
                    <button
                        className="btn btn-outline-secondary btn-sm dropdown-toggle me-2"
                        type="button"
                        onClick={toggleOpen}
                    >
                        {platformName || (
                            <FormattedMessage defaultMessage="Layout" description="Field label" />
                        )}
                    </button>
                    <ul className={classNames(['dropdown-menu', { show: open }])}>
                        {(platforms || []).map((it) => (
                            <li key={`platform-${it.id}`}>
                                <button
                                    type="button"
                                    className={classNames([
                                        'btn btn-sm btn-outline-secondary dropdown-item',
                                        {
                                            active: platform !== null && it.id === platform.id,
                                        },
                                    ])}
                                    onClick={() =>
                                        onClickPlatform(
                                            platform !== null && it.id === platform.id ? null : it,
                                        )
                                    }
                                >
                                    {it.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className={classNames([
                            'btn btn-sm btn-outline-secondary',
                            { active: size === 'desktop' },
                        ])}
                        onClick={() => onClickSize('desktop')}
                    >
                        <i className="bi-window-desktop" />
                    </button>
                    <button
                        type="button"
                        className={classNames([
                            'btn btn-sm btn-outline-secondary',
                            { active: size === 'tablet' },
                        ])}
                        onClick={() => onClickSize('tablet')}
                    >
                        <i className="bi-tablet" />
                    </button>
                    <button
                        type="button"
                        className={classNames([
                            'btn btn-sm btn-outline-secondary',
                            { active: size === 'phone' },
                        ])}
                        onClick={() => onClickSize('phone')}
                    >
                        <i className="bi-phone" />
                    </button>
                </div>
                <div className="ms-auto">
                    <button
                        type="button"
                        className={classNames(['btn btn-sm btn-outline-secondary btn-outline'])}
                        onClick={() => toggleFullscreen()}
                    >
                        <i className="bi-arrows-fullscreen" />
                    </button>
                </div>
            </div>
            <div className={styles.inner}>
                <div className={styles.editor}>{children}</div>
            </div>
        </div>
    );
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
