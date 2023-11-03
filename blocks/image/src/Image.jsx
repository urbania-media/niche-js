import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Editable, EditableImage, Widget } from '@niche-js/core/components';

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
    const { url = null, alt = 'Alternate text', caption = 'Image caption' } = media || {};
    return (
        <Widget
            tag="figure"
            className={classNames([styles.container, { [className]: className !== null }, 'image'])}
        >
            {url !== null ? (
                <EditableImage
                    className={styles.img}
                    name="media"
                    placeholder="Image"
                    src={url}
                    alt={alt}
                />
            ) : null}
            {caption !== null ? (
                <Editable
                    className={styles.caption}
                    tag="figcaption"
                    name="caption"
                    placeholder="Caption"
                    inline
                    html={caption || 'Empty'}
                />
            ) : null}
        </Widget>
    );
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
