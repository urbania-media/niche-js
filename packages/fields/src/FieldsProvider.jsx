/* eslint-disable react/jsx-props-no-spreading */
import FieldsProvider from '@panneau/fields';
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

function BlocksProvider({ components, ...props }) {
    const finalComponents = useMemo(
        () => ({
            ...builtInComponents,
            ...components,
        }),
        [components],
    );
    return <FieldsProvider components={finalComponents} {...props} />;
}

BlocksProvider.propTypes = propTypes;
BlocksProvider.defaultProps = defaultProps;

export default BlocksProvider;
