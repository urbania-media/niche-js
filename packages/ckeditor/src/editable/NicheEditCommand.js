import { Command } from '@ckeditor/ckeditor5-core';

export default class NicheEditCommand extends Command {
    execute(params) {
        const { editor } = this;
        const { selection } = editor.model.document;

        console.log('NicheEditCommand execute', params, selection);

        // TODO: trigger onChange blah
    }

    refresh() {
        // const { model } = this.editor;
        // const { selection } = model.document;
        // const isAllowed = model.schema.checkChild(selection.focus.parent, 'nicheComponent');
        this.isEnabled = true; // isAllowed;
    }
}
