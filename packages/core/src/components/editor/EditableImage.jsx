/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useIsEditor } from '../../contexts/EditorContext';

const propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    src: null,
    alt: null,
    className: null,
};

function EditableImage({ name, src, alt, className }) {
    const isEditor = /*#__PURE__*/useIsEditor();
    return isEditor ? (
        <img
            className={classNames([{ [className]: className !== null }])}
            data-niche-editable-image={name}
            src={src}
            alt={alt}
        />
    ) : (
        <img className={classNames([{ [className]: className !== null }])} src={src} alt={alt} />
    );
}

EditableImage.propTypes = propTypes;
EditableImage.defaultProps = defaultProps;

export default EditableImage;
