import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Editable, Widget } from '@niche-js/core/components';

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
    const { url = null, alt = null, caption = 'Image caption' } = media || {};

    return (
        <Widget className={classNames([styles.container, { [className]: className !== null }])}>
            {url !== null ? (
                <img data-niche-image="true" className={styles.img} src={url} alt={alt} />
            ) : (
                'Image block'
            )}
            {caption !== null ? (
                <Editable className={styles.caption} inline>
                    {caption || 'Empty'}
                </Editable>
            ) : null}
        </Widget>
    );
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
