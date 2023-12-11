import { Command } from '@ckeditor/ckeditor5-core';

import { findParentBlock } from '@niche-js/core/utils';

export default class NicheEditCommand extends Command {
    execute() {
        const { editor } = this;
        const { model } = editor || {};
        const { onRequestPicker = null } = editor || {};
        const { selection } = model.document;

        if (selection && onRequestPicker !== null) {
            const viewElement = selection.getSelectedElement() || null;
            const key = viewElement !== null ? viewElement.getAttribute('key') || null : null;
            const picker = viewElement !== null ? viewElement.getAttribute('picker') || null : null;
            const uuid = viewElement !== null ? findParentBlock(viewElement) || null : null;
            if (key !== null && picker !== null) {
                onRequestPicker(picker, key, uuid);
            }
        }
    }

    refresh() {
        const { editor } = this;
        const { onRequestPicker } = editor || {};
        const { selection } = editor.model.document;
        const viewElement = selection.getSelectedElement() || null;
        this.isEnabled = viewElement !== null && onRequestPicker !== null; // isAllowed;
    }
}
