import { Command } from '@ckeditor/ckeditor5-core';

function createImage(writer) {
    const nicheBlock = writer.createElement('nicheBlock');
    // const nicheBlockTitle = writer.createElement('nicheBlockTitle');
    const nicheBlockContent = writer.createElement('nicheBlockContent');

    // writer.append(nicheBlockTitle, nicheBlock);
    writer.append(nicheBlockContent, nicheBlock);

    // // There must be at least one paragraph for the description to be editable.
    // // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement('paragraph', nicheBlockContent);

    return nicheBlock;
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
            'nicheBlock',
        );

        this.isEnabled = allowedIn !== null;
    }
}
