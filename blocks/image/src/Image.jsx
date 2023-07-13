import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    media: PropTypes.shape({
        url: PropTypes.string,
    }),
    className: PropTypes.string,
};

const defaultProps = {
    media: null,
    className: null,
};

function Image({ media, className }) {
    const { url = null, alt = null } = media || {};
    return (
        <div
            className={classNames([styles.container, { [className]: className !== null }])}
            data-block-image
        >
            {url !== null ? <img className={styles.img} src={url} alt={alt} /> : 'Image block'}
            <div data-caption className={styles.caption}>
                {alt} Credits
            </div>
        </div>
    );
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
