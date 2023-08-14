/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

import { VIEWERS_NAMESPACE, ComponentsProvider } from '@niche-js/core/contexts';

import * as components from './components';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

const ViewersProvider = (props) => (
    <ComponentsProvider namespace={VIEWERS_NAMESPACE} components={components} {...props} />
);

ViewersProvider.propTypes = propTypes;
ViewersProvider.defaultProps = defaultProps;

export default ViewersProvider;
