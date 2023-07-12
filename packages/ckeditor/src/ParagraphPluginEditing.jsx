import { Paragraph, ParagraphCommand, InsertParagraphCommand } from '@ckeditor/ckeditor5-paragraph';

/* eslint-disable no-underscore-dangle */
export default class ParagraphPluginEditing extends Paragraph {
    static get pluginName() {
        return 'NicheParagraph';
    }

    init() {
        const { editor } = this;
        const { model } = editor;

        // editor.commands.add('paragraph', new ParagraphCommand(editor));
        // editor.commands.add('insertParagraph', new InsertParagraphCommand(editor));

        // Schema.
        model.schema.register('paragraph', { inheritAllFrom: '$block', attributes: ['blockType'] });

        editor.conversion.for('downcast').elementToElement({
            model: 'paragraph',
            view: (modelElement, { writer }) =>
                writer.createContainerElement('p', {
                    'data-block-type': 'text',
                }),
        });

        // Conversion for paragraph-like elements which has not been converted by any plugin.
        editor.conversion.for('upcast').elementToElement({
            model: (viewElement, { writer }) => {
                if (!Paragraph.paragraphLikeElements.has(viewElement.name)) {
                    return null;
                }

                // Do not auto-paragraph empty elements.
                if (viewElement.isEmpty) {
                    return null;
                }

                const blockType = viewElement.getAttribute('data-block-type');

                console.log(viewElement.name, blockType);

                return writer.createElement('paragraph', { blockType: 'text' });
            },
            view: /.+/,
            // view: {
            //     name: 'div',
            //     attributes: {
            //         'data-block-type': 'text',
            //     },
            // },
            converterPriority: 'low',
        });

        // super.init();
    }
}
