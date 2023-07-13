import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            media: PropTypes.shape({
                url: PropTypes.string,
            }),
        }),
    ),
    className: PropTypes.string,
};

const defaultProps = {
    items: null,
    className: null,
};

function Images({ items, className }) {
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {items !== null
                ? items.map(({ media }) => <img src={media.url} alt={media.alt || 'Media'} />)
                : null}
        </div>
    );
}

Images.propTypes = propTypes;
Images.defaultProps = defaultProps;

export default Images;
