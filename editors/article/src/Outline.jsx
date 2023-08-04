import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    components: PropTypes.arrayOf(PropTypes.shape({})),
    className: PropTypes.string,
    onClick: PropTypes.func,
    onClickRemove: PropTypes.func,
};

const defaultProps = {
    components: null,
    className: null,
    onClick: null,
    onClickRemove: null,
};

function Outline({ components, className, onClick, onClickRemove }) {
    return (
        <div className={classNames([styles.outline, { [className]: className !== null }])}>
            {(components || [])
                .filter(({ role = null }) => role === 'header')
                .map((it, i) => {
                    const { type = null } = it || {};
                    return (
                        <div key={`header-${i + 1}-${it.type}`} className="d-flex">
                            <button
                                key={`outline-${i + 1}-${it.type}`}
                                type="button"
                                className={classNames(['btn btn-sm text-start w-100'])}
                                onClick={() => onClick(it)}
                            >
                                <strong className="me-1">A</strong>
                                <span className="text-truncate">{type}</span>
                            </button>
                        </div>
                    );
                })}
            <hr />
            {(components || [])
                .filter(({ role = null }) => role === 'block')
                .map((it, i) => {
                    const { type = null, body = null, size } = it || {};
                    let label = (
                        <p className={styles.outlineLabel}>
                            <span className="me-1 text-capitalize">{type}</span>
                        </p>
                    );
                    const partialBody = body !== null ? body.replace(/<\/?[^>]+(>|$)/g, '') : null;
                    const finalBody = partialBody === '&nbsp;' ? '' : partialBody;

                    if (type === 'text') {
                        label = (
                            <p className={styles.outlineLabel}>
                                <strong className="me-1 text-capitalize">P</strong>
                                {finalBody}
                            </p>
                        );
                    }

                    if (type === 'heading') {
                        label = (
                            <p className={styles.outlineLabel}>
                                <strong className="me-1 text-capitalize">{`H${size}`}</strong>
                                {finalBody}
                            </p>
                        );
                    }

                    return (
                        <div key={`outline-${i + 1}-${it.type}`} className="d-flex">
                            <button
                                type="button"
                                className={classNames([
                                    'btn btn-sm text-truncate flex-grow-1 text-start',
                                    styles.outlineButton,
                                ])}
                                onClick={() => onClick(it)}
                            >
                                {label}
                            </button>
                            <button
                                key={`outline-${i + 1}-${it.type}`}
                                type="button"
                                className={classNames(['btn btn-sm', styles.outlineButton])}
                                onClick={() => onClickRemove(it)}
                            >
                                <i className="bi-x" />
                            </button>
                        </div>
                    );
                })}
        </div>
    );
}

Outline.propTypes = propTypes;
Outline.defaultProps = defaultProps;

export default Outline;
