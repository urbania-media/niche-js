/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

import { BLOCKS_NAMESPACE, ComponentsProvider } from '@niche-js/core/contexts';

import * as components from './components';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

const BlocksProvider = (props) => (
    <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={components} {...props} />
);

BlocksProvider.propTypes = propTypes;
BlocksProvider.defaultProps = defaultProps;

export default BlocksProvider;
