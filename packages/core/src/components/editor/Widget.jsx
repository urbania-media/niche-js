/* eslint-disable react/jsx-props-no-spreading */
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsEditor } from '@niche-js/core/contexts';

const propTypes = {
    tag: PropTypes.string,
    withoutUI: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    tag: 'div',
    withoutUI: false,
    className: null,
    children: null,
};

function Widget({ tag, withoutUI, className, children }) {
    const isEditor = useIsEditor();
    const Tag = tag || 'div';
    return (
        <Tag
            className={className}
            {...(isEditor ? { 'data-niche-widget': withoutUI ? 'false' : 'true' } : null)}
        >
            {children}
        </Tag>
    );
}

Widget.propTypes = propTypes;
Widget.defaultProps = defaultProps;

export default Widget;
