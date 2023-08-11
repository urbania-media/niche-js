import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';

/* #__NO_SIDE_EFFECTS__ */
export const EditorContext = React.createContext(null);

/* #__NO_SIDE_EFFECTS__ */
export const useEditor = () => useContext(EditorContext);

/* #__NO_SIDE_EFFECTS__ */
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

/* #__NO_SIDE_EFFECTS__ */
export const EditorProvider = ({ children }) => {
    const value = useMemo(() => ({ renderState: null }), []);
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

EditorProvider.propTypes = propTypes;
EditorProvider.defaultProps = defaultProps;
