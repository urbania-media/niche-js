// simplebox/insertsimpleboxcommand.js
import { Command } from '@ckeditor/ckeditor5-core';

export default class InsertBlockImageCommand extends Command {
    execute() {
        console.log('execute');

        this.editor.model.change((writer) => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertObject(createBlockImage(writer));
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'blockImage',
        );

        this.isEnabled = allowedIn !== null;
    }
}

function createBlockImage(writer) {
    console.log('createBlockImage');

    const blockImage = writer.createElement('blockImage');
    const blockImageContent = writer.createElement('blockImageContent');

    // const blockImageDescription = writer.createElement('blockImageDescription');

    writer.append(blockImageContent, blockImage);

    // writer.append(simpleBoxDescription, simpleBox);

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    // writer.appendElement('paragraph', simpleBoxDescription);

    return blockImage;
}
