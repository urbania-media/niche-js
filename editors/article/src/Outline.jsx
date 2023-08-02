import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    components: PropTypes.arrayOf(PropTypes.shape({})),
    className: PropTypes.string,
    onClick: PropTypes.func,
};

const defaultProps = {
    components: null,
    className: null,
    onClick: null,
};

function Outline({ components, className, onClick }) {
    return (
        <div className={classNames([styles.outline, { [className]: className !== null }])}>
            {(components || [])
                .filter(({ role = null }) => role === 'header')
                .map((it, i) => {
                    const { type = null } = it || {};
                    return (
                        <p key={`header-${i + 1}-${it.type}`} className={styles.outlineLabel}>
                            <span className={styles.pre}>Head</span>
                            {type}
                        </p>
                    );
                })}
            <hr />
            {(components || [])
                .filter(({ role = null }) => role === 'block')
                .map((it, i) => {
                    const { type = null, body = null, size } = it || {};
                    let label = <p className={styles.outlineLabel}>{type}</p>;
                    const partialBody = body !== null ? body.replace(/<\/?[^>]+(>|$)/g, '') : null;
                    const finalBody = partialBody === '&nbsp;' ? 'Empty' : partialBody;

                    if (type === 'text') {
                        label = (
                            <p className={styles.outlineLabel}>
                                <span className={styles.pre}>p</span>
                                {finalBody}
                            </p>
                        );
                    }
                    if (type === 'heading') {
                        label = (
                            <p className={styles.outlineLabel}>
                                <span className={styles.pre}>{`h${size}`}</span>
                                {finalBody}
                            </p>
                        );
                    }
                    return (
                        <button
                            key={`outline-${i + 1}-${it.type}`}
                            type="button"
                            className={styles.outlineItem}
                            onClick={() => onClick(it)}
                        >
                            {label}
                        </button>
                    );
                })}
        </div>
    );
}

Outline.propTypes = propTypes;
Outline.defaultProps = defaultProps;

export default Outline;
