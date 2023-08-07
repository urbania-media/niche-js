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
        <Widget className={classNames([styles.container, { [className]: className !== null }])}>
            {url !== null ? (
                <EditableImage className={styles.img} name="media" src={url} alt={alt} />
            ) : null}
            {caption !== null ? (
                <Editable className={styles.caption} name="caption" inline>
                    {caption || 'Empty'}
                </Editable>
            ) : null}
        </Widget>
    );
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
