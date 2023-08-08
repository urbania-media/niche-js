import { Command } from '@ckeditor/ckeditor5-core';

function createImage(writer) {
    const nicheComponent = writer.createElement('nicheComponent');
    // const nicheComponentTitle = writer.createElement('nicheComponentTitle');
    const nicheComponentContent = writer.createElement('nicheComponentContent');

    // writer.append(nicheComponentTitle, nicheComponent);
    writer.append(nicheComponentContent, nicheComponent);

    // // There must be at least one paragraph for the description to be editable.
    // // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement('paragraph', nicheComponentContent);

    return nicheComponent;
}

export default class InsertBlockCommand extends Command {
    execute() {
        this.editor.model.change((writer) => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertObject(createImage(writer));
        });
    }

    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;
        const allowedIn = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'nicheComponent',
        );

        this.isEnabled = allowedIn !== null;
    }
}
