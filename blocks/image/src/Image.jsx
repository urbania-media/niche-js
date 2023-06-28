import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

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

const Image = ({ media, className }) => {
    const { src = null } = media || {};
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {src !== null ? <image src={src} alt="image-alt-text" /> : null}
            <FormattedMessage defaultMessage="Credits" description="Block label" />
        </div>
    );
};

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
