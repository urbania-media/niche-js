import { Plugin } from 'ckeditor5/src/core';
import { WidgetToolbarRepository } from 'ckeditor5/src/widget';
import isObject from 'lodash/isObject';

import NicheEditable from './NicheEditable';

// import NicheDropdown from '../dropdown/NicheDropdown';

function normalizeDeclarativeConfig(config) {
    return config.map((item) => (isObject(item) ? item.name : item));
}

function hasEditToolbar(viewElement) {
    const author =
        viewElement.getAttribute('data-niche-editable') ||
        viewElement.getAttribute('data-niche-editable-inline') ||
        null;
    return author !== null;
}

function getClosestEditable(selection) {
    const selectionPosition = selection.getFirstPosition();

    if (!selectionPosition) {
        return null;
    }

    const viewElement = selection.getSelectedElement();

    if (viewElement && hasEditToolbar(viewElement)) {
        return viewElement;
    }

    let { parent } = selectionPosition;

    while (parent) {
        if (parent.is('element') && hasEditToolbar(parent)) {
            return parent;
        }
        parent = parent.parent;
    }

    return null;
}

export default class NicheEditableToolbar extends Plugin {
    static get requires() {
        return [WidgetToolbarRepository, NicheEditable];
    }

    static get pluginName() {
        return 'NicheEditableToolbar';
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const { editor } = this;
        const { t } = editor;
        const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);

        console.log('tool and die', editor.config.get('niche.editable.toolbar'));

        widgetToolbarRepository.register('NicheEditableToolbar', {
            ariaLabel: t('Edit toolbar'),
            items: normalizeDeclarativeConfig(editor.config.get('niche.editable.toolbar') || []),
            getRelatedElement: (selection) => getClosestEditable(selection),
        });
    }
}
