/* eslint-disable react/jsx-props-no-spreading */
// import PropTypes from 'prop-types';
import React from 'react';

import { PropTypes as NichePropTypes } from '@niche-js/core';
import {
    useComponent,
    BLOCKS_NAMESPACE,
    HEADERS_NAMESPACE,
    COMPONENTS_NAMESPACE,
} from '@niche-js/core/contexts';

const propTypes = {
    component: NichePropTypes.component.isRequired,
};

const defaultProps = {};

function ComponentNodeComponent({ component }) {
    const { role, type, ...data } = component;
    const namespaces = { block: BLOCKS_NAMESPACE, header: HEADERS_NAMESPACE };
    const Component = useComponent(type, null, namespaces[role] || COMPONENTS_NAMESPACE);
    return Component !== null ? <Component {...data} /> : null;
}

ComponentNodeComponent.propTypes = propTypes;
ComponentNodeComponent.defaultProps = defaultProps;

export default ComponentNodeComponent;
