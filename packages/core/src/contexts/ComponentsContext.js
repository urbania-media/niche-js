import {
    useComponentsManager,
    useComponents,
    useComponent,
    ComponentsProvider,
    useFieldComponent,
    FIELDS_NAMESPACE,
    useFieldsComponentsManager,
} from '@panneau/core/contexts';

export const EDITORS_NAMESPACE = 'editors';
export const VIEWERS_NAMESPACE = 'viewers';
export const COMPONENTS_NAMESPACE = 'components';
export const BLOCKS_NAMESPACE = 'blocks';
export const HEADERS_NAMESPACE = 'headers';
export const PICKERS_NAMESPACE = 'pickers';

export { ComponentsProvider, useFieldComponent, FIELDS_NAMESPACE, useFieldsComponentsManager };

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
export const useViewersComponentsManager = () => useComponentsManager(VIEWERS_NAMESPACE);

export const useViewersComponents = (defaultComponents = {}) =>
    useComponents(VIEWERS_NAMESPACE, defaultComponents);

export const useViewerComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, VIEWERS_NAMESPACE);

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

/**
 * Headers hooks
 */
export const useHeadersComponentsManager = () => useComponentsManager(HEADERS_NAMESPACE);

export const useHeadersComponents = (defaultComponents = {}) =>
    useComponents(HEADERS_NAMESPACE, defaultComponents);

export const useHeaderComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, HEADERS_NAMESPACE);

/**
 * Pickers hooks
 */
export const usePickersComponentsManager = () => useComponentsManager(PICKERS_NAMESPACE);

export const usePickersComponents = (defaultComponents = {}) =>
    useComponents(PICKERS_NAMESPACE, defaultComponents);

export const usePickerComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, PICKERS_NAMESPACE);
