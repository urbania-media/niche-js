import { useComponentsManager, useComponents, useComponent } from '@panneau/core/contexts';

export const EDITORS_NAMESPACE = 'editors';

/**
 * Editors hooks
 */
export const useEditorsComponentsManager = () => useComponentsManager(EDITORS_NAMESPACE);

export const useEditorsComponents = (defaultComponents = {}) =>
    useComponents(EDITORS_NAMESPACE, defaultComponents);

export const useEditorComponent = (name, defaultComponent = null) =>
    useComponent(name, defaultComponent, EDITORS_NAMESPACE);
