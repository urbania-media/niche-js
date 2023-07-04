import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    medias: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string,
        }),
    ),
    className: PropTypes.string,
};

const defaultProps = {
    medias: null,
    className: null,
};

function Gallery({ medias, className }) {
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {medias !== null
                ? medias.map((media) => <img src={media.src} alt={media.alt || 'Media'} />)
                : null}
        </div>
    );
}

Gallery.propTypes = propTypes;
Gallery.defaultProps = defaultProps;

export default Gallery;
