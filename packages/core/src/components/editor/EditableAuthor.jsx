/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsEditor } from '@niche-js/core/contexts';

const propTypes = {
    name: PropTypes.string,
    url: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    name: null,
    url: null,
    placeholder: null,
    className: null,
};

function EditableAuthor({ name, url, placeholder, className }) {
    const isEditor = useIsEditor();
    const title = name || placeholder || 'Author';
    return isEditor ? (
        <div
            className={classNames([{ [className]: className !== null }])}
            data-niche-editable-author={name}
            placeholder={placeholder}
            title={title}
        >
            {name}
        </div>
    ) : (
        <p>
            <a href={url} target="_blank" rel="noreferrer">
                {title}
            </a>
        </p>
    );
}

EditableAuthor.propTypes = propTypes;
EditableAuthor.defaultProps = defaultProps;

export default EditableAuthor;
