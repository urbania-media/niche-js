/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';

import Api from '../lib/Api';

const ApiContext = React.createContext(null);

export const useApi = () => useContext(ApiContext);

const propTypes = {
    api: PropTypes.instanceOf(Api),
    baseUrl: PropTypes.string,
    children: PropTypes.node.isRequired,
};

const defaultProps = {
    api: null,
    baseUrl: undefined,
};

export const ApiProvider = ({ api: initialApi, baseUrl, children }) => {
    const previousApi = useApi();
    const api = useMemo(
        () =>
            initialApi ||
            previousApi ||
            new Api({
                baseUrl,
                // baseUrl: 'https://niche.ca.test/api', // for testing
            }),
        [previousApi, initialApi, baseUrl],
    );
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

ApiProvider.propTypes = propTypes;
ApiProvider.defaultProps = defaultProps;

export default ApiContext;
