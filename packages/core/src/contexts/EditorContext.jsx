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
}

/* #__NO_SIDE_EFFECTS__ */
export function useEditorPlatform() {
    if (!__EDITOR__) {
        return null;
    }
    const { platform = null } = useContext(EditorContext) || {};
    return platform;
}

const propTypes = {
    platform: PropTypes.shape({}),
    children: PropTypes.node.isRequired,
};

const defaultProps = {
    platform: null,
};

/* #__NO_SIDE_EFFECTS__ */
export const EditorProvider = ({ platform, children }) => {
    const value = useMemo(() => ({ platform }), [platform]);
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

EditorProvider.propTypes = propTypes;
EditorProvider.defaultProps = defaultProps;
