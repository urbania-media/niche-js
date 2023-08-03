/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { PropTypes as NichePropTypes } from '../../lib';

import { useEditor } from '../../contexts';

const propTypes = {
    component: NichePropTypes.component.isRequired,
    tag: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    tag: 'div',
    className: null,
    children: null,
};

function Component({ component, tag, className, children }) {
    const editor = useEditor();
    const { id = null, uuid = null, role = null, type = null } = component || {};
    const Tag = tag || 'div';

    return (
        <Tag
            className={classNames([{ [className]: className !== null }])}
            {...(editor !== null
                ? {
                      'data-niche-id': id,
                      'data-niche-uuid': uuid,
                      'data-niche-role': role,
                      'data-niche-type': type,
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
