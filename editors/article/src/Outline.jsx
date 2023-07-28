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
            {(components || []).map((it, i) => {
                const { type = null, body = null, size } = it || {};
                let label = <p className={styles.outlineLabel}>{type}</p>;
                if (type === 'text') {
                    label = (
                        <p className={styles.outlineLabel}>
                            <span className={styles.pre}>p</span>
                            {body}
                        </p>
                    );
                }
                if (type === 'heading') {
                    label = (
                        <p className={styles.outlineLabel}>
                            <span className={styles.pre}>{`h${size}`}</span>
                            {body}
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