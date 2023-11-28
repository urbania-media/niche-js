/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

import { PICKERS_NAMESPACE, ComponentsProvider } from '@niche-js/core/contexts';

import * as components from './components';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

const PickersProvider = (props) => (
    <ComponentsProvider namespace={PICKERS_NAMESPACE} components={components || null} {...props} />
);

PickersProvider.propTypes = propTypes;
PickersProvider.defaultProps = defaultProps;

export default PickersProvider;
