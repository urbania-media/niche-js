import { Plugin } from 'ckeditor5/src/core';
import { WidgetToolbarRepository } from 'ckeditor5/src/widget';
import isObject from 'lodash/isObject';

import NicheDropdown from './NicheDropdown';

function normalizeDeclarativeConfig(config) {
    return config.map((item) => (isObject(item) ? item.name : item));
}

function widgetHasOptions(viewElement) {
    if (!viewElement) {
        return false;
    }
    const optionsName = viewElement.getAttribute('data-niche-editable-options') || null;
    return optionsName !== null;
}

function getClosestEditable(selection) {
    if (!selection) {
        return null;
    }

    const selectionPosition = selection.getFirstPosition();
    if (!selectionPosition) {
        return null;
    }

    const viewElement = selection.getSelectedElement();

    if (viewElement && widgetHasOptions(viewElement)) {
        return viewElement;
    }

    let { parent } = selectionPosition;

    while (parent) {
        if (parent.is('element') && widgetHasOptions(parent)) {
            return parent;
        }
        parent = parent.parent;
    }

    return null;
}

export default class NicheDropdownToolbar extends Plugin {
    static get requires() {
        return [WidgetToolbarRepository, NicheDropdown];
    }

    static get pluginName() {
        return 'NicheDropdownToolbar';
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const { editor } = this;
        const { t } = editor;

        const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);

        widgetToolbarRepository.register(`nicheEditableDropdown`, {
            ariaLabel: t('Editable dropdown toolbar'),
            items: normalizeDeclarativeConfig(['dropdown']),
            getRelatedElement: (selection) => getClosestEditable(selection),
        });
    }
}
