/* eslint-disable react/jsx-props-no-spreading */
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useIsEditor } from '@niche-js/core/contexts';

const propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    tag: 'div',
    className: null,
    children: null,
};

function Widget({ tag, className, children }) {
    const isEditor = /*#__PURE__*/useIsEditor();
    const Tag = tag || 'div';
    return (
        <Tag
            className={className}
            {...(isEditor ? { 'data-niche-widget': 'true' } : null)}
        >
            {children}
        </Tag>
    );
}

Widget.propTypes = propTypes;
Widget.defaultProps = defaultProps;

export default Widget;
