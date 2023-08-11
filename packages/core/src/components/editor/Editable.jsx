/* eslint-disable react/jsx-props-no-spreading */
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsEditor } from '@niche-js/core/contexts';

const propTypes = {
    name: PropTypes.string.isRequired,
    tag: PropTypes.string,
    attributes: PropTypes.string,
    html: PropTypes.string,
    inline: PropTypes.bool,
    className: PropTypes.string,
};

const defaultProps = {
    tag: 'div',
    attributes: null,
    html: null,
    inline: false,
    className: null,
};

function Editable({ name, tag, attributes, html, inline, className }) {
    const isEditor = /* #__PURE__ */useIsEditor();
    const Tag = inline ? 'div' : tag || 'div'; // Tag can be different in model
    return isEditor ? (
        <Tag
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
            {...(inline
                ? { 'data-niche-editable-inline': name, 'data-niche-editable-tag': tag || 'div' }
                : { 'data-niche-editable': name })}
            {...(attributes !== null ? { 'data-niche-editable-attributes': attributes } : null)}
        />
    ) : (
        <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
    );
}

Editable.propTypes = propTypes;
Editable.defaultProps = defaultProps;

export default Editable;
