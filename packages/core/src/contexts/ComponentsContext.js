import { useComponentsManager, useComponents, useComponent } from '@panneau/core/contexts';

export const EDITORS_NAMESPACE = 'editors';
export const VIEWER_NAMESPACE = 'viewers';
export const COMPONENTS_NAMESPACE = 'components';
export const BLOCKS_NAMESPACE = 'components.blocks';
// export const SCREENS_NAMESPACE = 'components.screens';

/**
 * Editors hooks
 */
export const useEditorsComponentsManager = () => useComponentsManager(EDITORS_NAMESPACE);

export const useEditorsComponents = (defaultComponents = {}) =>
    useComponents(EDITORS_NAMESPACE, defaultComponents);

export const useEditorComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, EDITORS_NAMESPACE);

/**
 * Viewers hooks
 */
export const useViewersComponentsManager = () => useComponentsManager(VIEWER_NAMESPACE);

export const useViewersComponents = (defaultComponents = {}) =>
    useComponents(VIEWER_NAMESPACE, defaultComponents);

export const useViewerComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, VIEWER_NAMESPACE);

/**
 * Components hooks
 */
export const useDocumentComponentsManager = () => useComponentsManager(COMPONENTS_NAMESPACE);

export const useDocumentComponents = (defaultComponents = {}) =>
    useComponents(COMPONENTS_NAMESPACE, defaultComponents);

export const useDocumentComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, COMPONENTS_NAMESPACE);

/**
 * Blocks hooks
 */
export const useBlocksComponentsManager = () => useComponentsManager(BLOCKS_NAMESPACE);

export const useBlocksComponents = (defaultComponents = {}) =>
    useComponents(BLOCKS_NAMESPACE, defaultComponents);

export const useBlockComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, BLOCKS_NAMESPACE);
