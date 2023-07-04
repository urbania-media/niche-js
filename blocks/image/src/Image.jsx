import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    media: PropTypes.shape({
        src: PropTypes.string,
    }),
    className: PropTypes.string,
};

const defaultProps = {
    media: null,
    className: null,
};

function Image({ media, className }) {
    const { src = null, alt = null } = media || {};
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {src !== null ? <img src={src} alt={alt} /> : 'Image block'}
        </div>
    );
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
