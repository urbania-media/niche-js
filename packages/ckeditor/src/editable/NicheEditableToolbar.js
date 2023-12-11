import { Plugin } from 'ckeditor5/src/core';
import { WidgetToolbarRepository } from 'ckeditor5/src/widget';
import isObject from 'lodash/isObject';

import NicheEditable from './NicheEditable';

// import NicheDropdown from '../dropdown/NicheDropdown';

function normalizeDeclarativeConfig(config) {
    return config.map((item) => (isObject(item) ? item.name : item));
}

function hasEditToolbar(viewElement) {
    const element = viewElement.getAttribute('data-niche-editable-picker') || null;
    return element !== null;
}

function getClosestEditable(selection) {
    const selectionPosition = selection.getFirstPosition();
    // console.log('selection', selection);

    if (!selectionPosition) {
        return null;
    }

    const viewElement = selection.getSelectedElement();

    // console.log('viewElement', viewElement);
    // console.log('selectionPosition', selectionPosition);

    const hasToolbar = viewElement ? hasEditToolbar(viewElement) : false;

    // console.log('viewElement', viewElement);

    if (viewElement && hasToolbar) {
        return viewElement;
    }

    let { parent } = selectionPosition;

    while (parent) {
        if (parent.is('element') && hasEditToolbar(parent)) {
            // console.log('parent match hasToolbar', parent, viewElement);
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

        widgetToolbarRepository.register('NicheEditableToolbar', {
            ariaLabel: t('Edit toolbar'),
            items: normalizeDeclarativeConfig(editor.config.get('niche.editable.toolbar') || []),
            getRelatedElement: (selection) => getClosestEditable(selection),
        });
    }
}
