/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

import { EDITORS_NAMESPACE, ComponentsProvider } from '@niche-js/core/contexts';

import * as components from './components';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

const EditorsProvider = (props) => (
    <ComponentsProvider namespace={EDITORS_NAMESPACE} components={components} {...props} />
);

EditorsProvider.propTypes = propTypes;
EditorsProvider.defaultProps = defaultProps;

export default EditorsProvider;
