/* eslint-disable react/jsx-props-no-spreading */
import { ComponentsProvider } from '@panneau/core/contexts';
import PropTypes from 'prop-types';
import React from 'react';

import { HEADERS_NAMESPACE } from '@niche-js/core/contexts';

import * as components from './components';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

const HeadersProvider = (props) => (
    <ComponentsProvider namespace={HEADERS_NAMESPACE} components={components} {...props} />
);

HeadersProvider.propTypes = propTypes;
HeadersProvider.defaultProps = defaultProps;

export default HeadersProvider;
