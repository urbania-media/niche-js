/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useEditor } from '../../contexts';

const propTypes = {
    name: PropTypes.string.isRequired,
    tag: PropTypes.string,
    inline: PropTypes.bool,
    attributes: PropTypes.string,
    html: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    tag: 'div',
    inline: false,
    attributes: null,
    html: null,
    className: null,
};

function Editable({ name, tag, inline, attributes, html, className }) {
    const editor = useEditor();
    const Tag = tag || 'div';
    return editor !== null ? (
        <Tag
            className={classNames([{ [className]: className !== null }])}
            dangerouslySetInnerHTML={{ __html: html }}
            {...(inline ? { 'data-niche-editable-inline': name } : { 'data-niche-editable': name })}
            {...(attributes !== null ? { 'data-niche-editable-attributes': attributes } : null)}
        />
    ) : (
        <Tag
            className={classNames([{ [className]: className !== null }])}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

Editable.propTypes = propTypes;
Editable.defaultProps = defaultProps;

export default Editable;
