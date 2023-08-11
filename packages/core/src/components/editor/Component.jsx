/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { PropTypes as NichePropTypes } from '@niche-js/core';

import { useIsEditor } from '../../contexts/EditorContext';

const propTypes = {
    component: NichePropTypes.component.isRequired,
    tag: PropTypes.string,
    inline: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    tag: 'div',
    inline: false,
    className: null,
    children: null,
};

function Component({ component, tag, inline, className, children }) {
    const isEditor = /*#__PURE__*/useIsEditor();
    const { id = null, uuid = null, role = null, type = null, platform = null } = component || {};
    const Tag = tag || 'div';
    return (
        <Tag
            className={classNames([{ [className]: className !== null }])}
            {...(isEditor
                ? {
                      'data-niche-id': id,
                      'data-niche-uuid': uuid,
                      'data-niche-role': role,
                      'data-niche-type': type,
                      'data-niche-inline': inline,
                      'data-niche-platform': platform,
                  }
                : null)}
        >
            {children}
        </Tag>
    );
}

Component.propTypes = propTypes;
Component.defaultProps = defaultProps;

export default Component;
