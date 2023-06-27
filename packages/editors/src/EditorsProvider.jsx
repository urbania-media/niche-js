/* eslint-disable react/jsx-props-no-spreading */
import { EDITORS_NAMESPACE } from '@niche-js/core/contexts';
import { ComponentsProvider } from '@panneau/core/contexts';
import PropTypes from 'prop-types';
import React from 'react';

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
