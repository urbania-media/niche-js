import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';

export const EditorContext = React.createContext(null);

export const useEditor = () => useContext(EditorContext);

export function useIsEditor() {
    if (!__EDITOR__) {
        return false;
    }
    const editorContext = useContext(EditorContext);
    return editorContext !== null;
};

const propTypes = {
    children: PropTypes.node.isRequired,
};

const defaultProps = {};

export const EditorProvider = ({ children }) => {
    const value = useMemo(() => ({ renderState: null }), []);
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

EditorProvider.propTypes = propTypes;
EditorProvider.defaultProps = defaultProps;
