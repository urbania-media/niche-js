/* eslint-disable no-underscore-dangle */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

import InsertBlockTextCommand from './insertblocktextcommand';

export default class BlockTextEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertBlockText', new InsertBlockTextCommand(this.editor));
    }

    _defineSchema() {
        const { schema } = this.editor.model;
        schema.register('blockText', {
            inheritAllFrom: '$blockObject',
        });

        schema.register('blockTextContent', {
            isLimit: true,
            allowIn: 'blockText',
            allowContentOf: '$root',
            // allowContentOf: '$block',
        });

        schema.addChildCheck((context, childDefinition) => {
            if (context.endsWith('blockTextContent') && childDefinition.name === 'blockText') {
                return false;
            }
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            model: 'blockText',
            view: {
                name: 'div',
                attributes: {
                    'data-block-type': 'text',
                },

                // classes: 'block',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'blockText',
            view: {
                name: 'div',
                attributes: {
                    'data-block-type': 'text',
                },
                // classes: 'block',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'blockText',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createContainerElement('div', {
                    attributes: {
                        'data-block-type': 'text',
                    },
                    // class: 'block',
                });
                return toWidget(div, viewWriter, { label: 'block text widget' });
            },
        });
        conversion.for('upcast').elementToElement({
            model: 'blockTextContent',
            view: {
                name: 'div',
                classes: 'block-text-content',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'blockTextContent',
            view: {
                name: 'div',
                classes: 'block-text-content',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'blockTextContent',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement('div', {
                    class: 'block-text-content',
                });
                return toWidgetEditable(div, viewWriter);
            },
        });
    }
}
