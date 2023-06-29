// simplebox/insertsimpleboxcommand.js
import { Command } from '@ckeditor/ckeditor5-core';

export default class InsertBlockTextCommand extends Command {
    execute() {
        console.log('execute');

        this.editor.model.change((writer) => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertObject(createBlockText(writer));
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'blockText');

        this.isEnabled = allowedIn !== null;
    }
}

function createBlockText(writer) {
    console.log('createBlockText');

    const blockText = writer.createElement('blockText');
    const blockTextContent = writer.createElement('blockTextContent');

    // const blockTextDescription = writer.createElement('blockTextDescription');

    writer.append(blockTextContent, blockText);

    // writer.append(simpleBoxDescription, simpleBox);

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    // writer.appendElement('paragraph', simpleBoxDescription);

    return blockText;
}
