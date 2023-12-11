/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsEditor } from '@niche-js/core/contexts';

import styles from '../../styles/editor/editable-field.module.css';

const propTypes = {
    name: PropTypes.string.isRequired,
    tag: PropTypes.string,
    html: PropTypes.string,
    children: PropTypes.node,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    tag: 'div',
    html: null,
    children: null,
    placeholder: null,
    className: null,
};

function EditableField({ name, tag, html, children, placeholder, className }) {
    const isEditor = useIsEditor();
    const Tag = tag || 'div';
    const title = name || tag || placeholder || null;
    const finalPlaceholder = placeholder || name || null;
    const emptyHtml = children === null && (isEmpty(html) || html === '&nbsp;');

    return isEditor ? (
        <Tag
            className={classNames([
                styles.container,
                {
                    [styles.empty]: emptyHtml,
                    [className]: className !== null,
                },
            ])}
            title={title}
            dangerouslySetInnerHTML={html !== null ? { __html: html } : null}
            {...(name !== null ? { 'data-niche-editable-field': name } : null)}
            {...(name !== null ? { 'data-niche-editable-name': name } : null)}
            {...(title !== null ? { 'data-niche-editable-placeholder': finalPlaceholder } : null)}
        >
            {children}
        </Tag>
    ) : (
        <Tag
            className={className}
            dangerouslySetInnerHTML={html !== null ? { __html: html } : null}
        >
            {children}
        </Tag>
    );
}

EditableField.propTypes = propTypes;
EditableField.defaultProps = defaultProps;

export default EditableField;
