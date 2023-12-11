/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsEditor } from '@niche-js/core/contexts';

import styles from '../../styles/editor/editable-picker.module.css';

const propTypes = {
    name: PropTypes.string.isRequired,
    tag: PropTypes.string,
    attributes: PropTypes.string,
    html: PropTypes.string,
    children: PropTypes.node,
    inline: PropTypes.bool,
    picker: PropTypes.string,
    placeholder: PropTypes.string,
    empty: PropTypes.bool,
    className: PropTypes.string,
};

const defaultProps = {
    tag: 'div',
    attributes: null,
    html: null,
    children: null,
    inline: false,
    picker: null,
    placeholder: null,
    empty: false,
    className: null,
};

function EditablePicker({
    name,
    tag,
    attributes,
    html,
    children,
    inline,
    picker,
    placeholder,
    empty,
    className,
}) {
    const isEditor = useIsEditor();
    const Tag = tag || 'div';
    const title = name || tag || placeholder || null;
    const finalPlaceholder = placeholder || name || null;
    const emptyHtml = empty || (children === null && (isEmpty(html) || html === '&nbsp;'));

    return isEditor ? (
        <Tag
            className={classNames([
                styles.container,
                {
                    [styles.inline]: inline,
                    [styles.empty]: emptyHtml,
                    [className]: className !== null,
                },
            ])}
            title={title}
            dangerouslySetInnerHTML={html !== null ? { __html: html } : null}
            data-cke-ignore-events="true"
            {...(name !== null ? { 'data-niche-editable-name': name } : null)}
            {...(picker !== null ? { 'data-niche-editable-picker': picker } : null)}
            {...(attributes !== null ? { 'data-niche-editable-attributes': attributes } : null)}
            {...(finalPlaceholder !== null
                ? { 'data-niche-editable-placeholder': finalPlaceholder }
                : null)}
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

EditablePicker.propTypes = propTypes;
EditablePicker.defaultProps = defaultProps;

export default EditablePicker;
