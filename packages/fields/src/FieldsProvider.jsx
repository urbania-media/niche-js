/* eslint-disable react/jsx-props-no-spreading */
import FieldsProvider from '@panneau/fields';
import PropTypes from 'prop-types';
import React from 'react';

import * as components from './components';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

const BlocksProvider = (props) => (
    <FieldsProvider components={components} {...props} />
);

BlocksProvider.propTypes = propTypes;
BlocksProvider.defaultProps = defaultProps;

export default BlocksProvider;
