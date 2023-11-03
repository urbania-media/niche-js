import { Plugin } from 'ckeditor5/src/core';
import { WidgetToolbarRepository } from 'ckeditor5/src/widget';
import isObject from 'lodash/isObject';

import NicheDropdown from '../dropdown/NicheDropdown';

function normalizeDeclarativeConfig(config) {
    return config.map((item) => (isObject(item) ? item.name : item));
}

function isAuthorWidget(viewElement) {
    const author = viewElement.getAttribute('data-niche-editable-author') || null;
    return author !== null;
}

function getClosestAuthor(selection) {
    const selectionPosition = selection.getFirstPosition();

    if (!selectionPosition) {
        return null;
    }

    const viewElement = selection.getSelectedElement();

    if (viewElement && isAuthorWidget(viewElement)) {
        return viewElement;
    }

    let { parent } = selectionPosition;

    while (parent) {
        if (parent.is('element') && isAuthorWidget(parent)) {
            return parent;
        }
        parent = parent.parent;
    }

    return null;
}

export default class NicheAuthorToolbar extends Plugin {
    static get requires() {
        return [WidgetToolbarRepository, NicheDropdown];
    }

    static get pluginName() {
        return 'NicheAuthorToolbar';
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const { editor } = this;
        const { t } = editor;
        const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);

        widgetToolbarRepository.register('nicheEditableAuthor', {
            ariaLabel: t('Author toolbar'),
            items: normalizeDeclarativeConfig(editor.config.get('niche.author.toolbar') || []),
            getRelatedElement: (selection) => getClosestAuthor(selection),
        });
    }
}
