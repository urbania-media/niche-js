/* eslint-disable react/jsx-props-no-spreading */
import PanneauFieldsProvider from '@panneau/fields';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import * as builtInComponents from './components';

const propTypes = {
    children: PropTypes.node,
    components: PropTypes.objectOf(PropTypes.elementType),
};

const defaultProps = {
    children: null,
    components: null,
};

function FieldsProvider({ components, ...props }) {
    const finalComponents = useMemo(
        () => ({
            ...builtInComponents,
            ...components,
        }),
        [components],
    );
    return <PanneauFieldsProvider components={finalComponents} {...props} />;
}

FieldsProvider.propTypes = propTypes;
FieldsProvider.defaultProps = defaultProps;

export default FieldsProvider;
