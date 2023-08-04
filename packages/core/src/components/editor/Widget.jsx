/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useEditor } from '../../contexts';

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
    const editor = useEditor();
    const Tag = tag || 'div';
    return (
        <Tag
            className={classNames([{ [className]: className !== null }])}
            {...(editor !== null ? { 'data-niche-widget': 'true' } : null)}
        >
            {children}
        </Tag>
    );
}

Widget.propTypes = propTypes;
Widget.defaultProps = defaultProps;

export default Widget;
