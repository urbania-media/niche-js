import { Command } from "@ckeditor/ckeditor5-core";

function createSimpleBox(writer) {
    const simpleBox = writer.createElement('simpleBox');
    // const simpleBoxTitle = writer.createElement('simpleBoxTitle');
    // const simpleBoxDescription = writer.createElement('simpleBoxDescription');

    // writer.append(simpleBoxTitle, simpleBox);
    // writer.append(simpleBoxDescription, simpleBox);

    // // There must be at least one paragraph for the description to be editable.
    // // See https://github.com/ckeditor/ckeditor5/issues/1464.
    // writer.appendElement('paragraph', simpleBoxDescription);

    return simpleBox;
}

export default class InsertBlockCommand extends Command {
    execute() {
        this.editor.model.change((writer) => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertObject(createSimpleBox(writer));
        });
    }

    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'simpleBox');

        this.isEnabled = allowedIn !== null;
    }
}
