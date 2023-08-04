import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import useFullscreen from '../../hooks/useFullscreen';

import styles from '../../styles/editor/preview.module.css';

const propTypes = {
    destinations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        }),
    ),
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    destinations: [
        { id: 'urbania_ca', name: 'urbania.ca' },
        { id: 'urbania_fr', name: 'urbania.fr' },
    ],
    className: null,
    children: null,
};

function Preview({ destinations, className, children }) {
    const { toggle: toggleFullscreen, active: fullscreen = false } = useFullscreen();

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
    const [destination, setDestination] = useState('urbania');
    const onClickDestination = useCallback(
        (newDestination) => {
            setDestination(newDestination);
            setOpen(false);
        },
        [destination, setDestination],
    );
    const { name: destinationName = null } = destination || {};

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
                {/* <div className="label me-2">
                    <FormattedMessage defaultMessage="Layout" description="Field label" />
                </div> */}
                <div className="dropdown">
                    <button
                        className="btn btn-outline-secondary btn-sm dropdown-toggle me-2"
                        type="button"
                        onClick={toggleOpen}
                    >
                        {destinationName || (
                            <FormattedMessage defaultMessage="Layout" description="Field label" />
                        )}
                    </button>
                    <ul className={classNames(['dropdown-menu', { show: open }])}>
                        {(destinations || []).map((dest) => (
                            <li>
                                <button
                                    type="button"
                                    key={`layout-${dest.name}`}
                                    className={classNames([
                                        'btn btn-sm btn-outline-secondary dropdown-item',
                                        {
                                            active:
                                                destination !== null && dest.id === destination.id,
                                        },
                                    ])}
                                    onClick={() =>
                                        onClickDestination(
                                            destination !== null && dest.id === destination.id
                                                ? null
                                                : dest,
                                        )
                                    }
                                >
                                    {dest.name}
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
