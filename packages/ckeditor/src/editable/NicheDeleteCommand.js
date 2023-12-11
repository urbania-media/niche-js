import { Command } from '@ckeditor/ckeditor5-core';

import { findParentBlock } from '@niche-js/core/utils';

export default class NicheDeleteCommand extends Command {
    execute() {
        const { editor } = this;
        const { model } = editor || {};
        const { onRequestRemove = null } = editor || {};
        const { selection } = model.document;

        if (selection && onRequestRemove !== null) {
            const viewElement = selection.getSelectedElement() || null;
            const key = viewElement !== null ? viewElement.getAttribute('key') || null : null;
            const uuid = viewElement !== null ? findParentBlock(viewElement) || null : null;
            if (key !== null && uuid !== null) {
                onRequestRemove(key, uuid);
            }
        }
    }

    refresh() {
        const { editor } = this;
        const { onRequestRemove } = editor || {};
        const { selection } = editor.model.document;
        const viewElement = selection.getSelectedElement() || null;

        this.isEnabled = viewElement !== null && onRequestRemove !== null; // isAllowed;
    }
}
