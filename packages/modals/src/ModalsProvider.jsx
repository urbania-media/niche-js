/* eslint-disable react/jsx-props-no-spreading */
import PanneauModalsProvider from '@panneau/modals';
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

function ModalsProvider({ components, ...props }) {
    const finalComponents = useMemo(
        () => ({
            ...builtInComponents,
            ...components,
        }),
        [components],
    );
    return <PanneauModalsProvider components={finalComponents} {...props} />;
}

ModalsProvider.propTypes = propTypes;
ModalsProvider.defaultProps = defaultProps;

export default ModalsProvider;
