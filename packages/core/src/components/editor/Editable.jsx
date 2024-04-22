/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsEditor } from '@niche-js/core/contexts';

import { useEditorsComponentsManager } from '../../contexts';

import styles from '../../styles/editor/editable.module.css';

const propTypes = {
    name: PropTypes.string.isRequired,
    tag: PropTypes.string,
    attributes: PropTypes.string,
    html: PropTypes.string,
    children: PropTypes.node,
    inline: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    tag: 'div',
    attributes: null,
    html: null,
    children: null,
    inline: false,
    placeholder: null,
    className: null,
};

function Editable({
    name,
    tag,
    attributes,
    html,
    children,
    inline,
    placeholder,
    className,
    ...props
}) {
    const isEditor = useIsEditor();
    const editorsComponentsManager = isEditor ? useEditorsComponentsManager() : null;
    const Tag = tag || 'div';
    const title = name || tag || placeholder || null;
    const finalPlaceholder = placeholder || name || null;
    const emptyHtml = children === null && (isEmpty(html) || html === '&nbsp;');

    if (isEditor) {
        const EditorComponent = editorsComponentsManager.getComponent('html');
        return EditorComponent !== null ? (
            <Tag
                className={classNames([
                    styles.container,
                    { [styles.empty]: emptyHtml, [className]: className !== null },
                ])}
            >
                <EditorComponent value={html} inline={inline} nested />
            </Tag>
        ) : null;
    }

    return isEditor ? (
        <Tag
            className={classNames([
                styles.container,
                { [styles.empty]: emptyHtml, [className]: className !== null },
            ])}
            title={title}
            dangerouslySetInnerHTML={html !== null ? { __html: html } : null}
            {...(inline
                ? { 'data-niche-editable-inline': name, 'data-niche-editable-tag': tag || 'div' }
                : { 'data-niche-editable': name })}
            {...(attributes !== null ? { 'data-niche-editable-attributes': attributes } : null)}
            {...(finalPlaceholder !== null
                ? { 'data-niche-editable-placeholder': finalPlaceholder }
                : null)}
            {...props}
        >
            {children}
        </Tag>
    ) : (
        <Tag
            className={className}
            dangerouslySetInnerHTML={html !== null ? { __html: html } : null}
            {...props}
        >
            {children}
        </Tag>
    );
}

Editable.propTypes = propTypes;
Editable.defaultProps = defaultProps;

export default Editable;
