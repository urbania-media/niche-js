import { Command } from '@ckeditor/ckeditor5-core';

export default class NicheDeleteCommand extends Command {
    execute(params) {
        const { editor } = this;
        const { selection } = editor.model.document;

        console.log('NicheDeleteCommand execute', params, selection);

        // TODO: trigger onChange blah
    }

    refresh() {
        // const { model } = this.editor;
        // const { selection } = model.document;
        // const isAllowed = model.schema.checkChild(selection.focus.parent, 'div');

        this.isEnabled = true; // isAllowed;
    }
}
