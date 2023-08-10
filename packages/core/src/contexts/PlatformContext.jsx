import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';

export const PlatformContext = React.createContext(null);

export const usePlatformContext = () => useContext(PlatformContext);

export const usePlatform = () => {
    const { platform } = useContext(PlatformContext);
    return platform;
};

const propTypes = {
    platform: PropTypes.string,
    children: PropTypes.node.isRequired,
};

const defaultProps = {
    platform: null,
};

export const PlatformProvider = ({ platform, children }) => {
    const value = useMemo(() => ({ platform }), [platform]);
    return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

PlatformProvider.propTypes = propTypes;
PlatformProvider.defaultProps = defaultProps;
