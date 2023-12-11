import { Command } from '@ckeditor/ckeditor5-core';

export default class NicheDropdownCommand extends Command {
    execute({ value }) {
        const { editor } = this;
        const { selection } = editor.model.document;

        console.log('NicheDropdownCommand execute', value, selection);

        // TODO: fix ths with a replace?
        // editor.model.change((writer) => {
        //     // Create a <placeholder> element with the "name" attribute (and all the selection attributes)...
        //     const dropdown = writer.createElement('placeholder', {
        //         ...Object.fromEntries(selection.getAttributes()),
        //         name: value,
        //     });

        //     // ... and insert it into the document. Put the selection on the inserted element.
        //     editor.model.insertObject(dropdown, null, null, { setSelection: 'on' });
        // });
    }

    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;

        // const isAllowed = model.schema.checkChild(selection.focus.parent, 'placeholder');
        const isAllowed = false;

        this.isEnabled = true || isAllowed;
    }
}
