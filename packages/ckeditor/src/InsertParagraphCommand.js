import { Command, Editor } from '@ckeditor/ckeditor5-core';
import { Element, Position } from '@ckeditor/ckeditor5-engine';
import { v4 as uuidV4 } from 'uuid';

/**
 * The insert paragraph command. It inserts a new paragraph at a specific
 * {@link module:engine/model/position~Position document position}.
 *
 * ```ts
 * // Insert a new paragraph before an element in the document.
 * editor.execute( 'insertParagraph', {
 *   position: editor.model.createPositionBefore( element )
 * } );
 * ```
 *
 * If a paragraph is disallowed in the context of the specific position, the command
 * will attempt to split position ancestors to find a place where it is possible
 * to insert a paragraph.
 *
 * **Note**: This command moves the selection to the inserted paragraph.
 */
export default class InsertParagraphCommand extends Command {
    constructor(editor) {
        super(editor);

        console.log('create insert paragraph');

        // Since this command passes position in execution block instead of selection, it should be checked directly.
        this._isEnabledBasedOnSelection = false;
    }

    /**
     * Executes the command.
     *
     * @param options Options for the executed command.
     * @param options.position The model position at which the new paragraph will be inserted.
     * @param options.attributes Attributes keys and values to set on a inserted paragraph.
     * @fires execute
     */
    execute(options) {
        console.log('execute');

        const model = this.editor.model;
        const attributes = options.attributes;

        let position = options.position;

        // Don't execute command if position is in non-editable place.
        if (!model.canEditAt(position)) {
            return;
        }

        model.change((writer) => {
            console.log('AAAAAAAAAAAAA IM ALIVE');

            const textContainer = writer.createElement('div', {
                tag: 'p',
                class: 'some class',
                id: uuidV4(),
                type: 'text',
                inline: 'true',
            });
            const paragraph = writer.createElement('paragraph');

            const allowedParent = model.schema.findAllowedParent(position, paragraph);

            // It could be there's no ancestor limit that would allow paragraph.
            // In theory, "paragraph" could be disallowed even in the "$root".
            if (!allowedParent) {
                return;
            }

            if (attributes) {
                model.schema.setAllowedAttributes(paragraph, attributes, writer);
            }

            if (position.path.length < 2) {
                model.insertContent(paragraph, position);
                writer.setSelection(paragraph, 'in');

                return;
            }

            const positionParent = position.parent;

            // E.g.
            // <paragraph>[]</paragraph> ---> <paragraph></paragraph><paragraph>[]</paragraph>
            const isInEmptyBlock = positionParent.isEmpty;

            // E.g.
            // <paragraph>foo[]</paragraph> ---> <paragraph>foo</paragraph><paragraph>[]</paragraph>
            const isAtEndOfTextBlock = position.isAtEnd && !positionParent.isEmpty;

            // E.g.
            // <paragraph>[]foo</paragraph> ---> <paragraph>[]</paragraph><paragraph>foo</paragraph>
            const isAtStartOfTextBlock = position.isAtStart && !positionParent.isEmpty;

            const canBeChild = model.schema.checkChild(positionParent, paragraph);

            if (isInEmptyBlock || isAtEndOfTextBlock) {
                position = writer.createPositionAfter(positionParent);
            } else if (isAtStartOfTextBlock) {
                position = writer.createPositionBefore(positionParent);
            } else if (!canBeChild) {
                position = writer.split(position, allowedParent).position;
            }

            model.insertContent(paragraph, position);

            writer.setSelection(paragraph, 'in');
        });
    }
}
