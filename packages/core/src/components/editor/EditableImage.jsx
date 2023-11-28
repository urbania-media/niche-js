/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsEditor } from '@niche-js/core/contexts';

// import placeholderImage from '../../images/placeholder.png';

const propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string,
    alt: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    src: null,
    alt: null,
    placeholder: null,
    className: null,
};

function EditableImage({ name, src, alt, placeholder, className }) {
    const isEditor = useIsEditor();
    const title = name || placeholder || 'Image';
    const defaultImage = src || null;
    return isEditor ? (
        <img
            className={classNames([{ [className]: className !== null }])}
            data-niche-editable-image={name}
            src={defaultImage}
            alt={alt}
            title={title}
        />
    ) : (
        <img className={classNames([{ [className]: className !== null }])} src={src} alt={alt} />
    );
}

EditableImage.propTypes = propTypes;
EditableImage.defaultProps = defaultProps;

export default EditableImage;
