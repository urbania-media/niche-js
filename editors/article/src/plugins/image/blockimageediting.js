/* eslint-disable no-underscore-dangle */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { Image } from '@ckeditor/ckeditor5-image';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

import InsertBlockImageCommand from './insertblockimagecommand';

export default class BlockImageEditing extends Plugin {
    static get requires() {
        return [Widget, Image];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertBlockImage', new InsertBlockImageCommand(this.editor));
    }

    _defineSchema() {
        const { schema } = this.editor.model;
        schema.register('blockImage', {
            inheritAllFrom: '$blockObject',
        });

        schema.register('blockImageContent', {
            isLimit: true,
            allowIn: 'blockImage',
            allowContentOf: '$root',
            // allowContentOf: '$block',
        });

        schema.register('blockImageDescription', {
            isLimit: true,
            allowIn: 'blockImage',
            allowContentOf: '$root',
            // allowContentOf: '$block',
        });

        schema.addChildCheck((context, childDefinition) => {
            if (context.endsWith('blockImageContent') && childDefinition.name === 'blockImage') {
                return false;
            }
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            model: 'blockImage',
            view: {
                name: 'div',
                attributes: {
                    'data-block-type': 'image',
                },

                // classes: 'block',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'blockImage',
            view: {
                name: 'div',
                attributes: {
                    'data-block-type': 'image',
                },
                // classes: 'block',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'blockImage',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createContainerElement('div', {
                    attributes: {
                        'data-block-type': 'image',
                    },
                    // class: 'block',
                });
                return toWidget(div, viewWriter, { label: 'block text widget' });
            },
        });

        // blockImageContent //

        conversion.for('upcast').elementToElement({
            model: 'blockImageContent',
            view: {
                name: 'div',
                classes: 'block-image-content',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'blockImageContent',
            view: {
                name: 'div',
                classes: 'block-image-content',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'blockImageContent',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement('div', {
                    class: 'block-image-content',
                });
                return toWidgetEditable(div, viewWriter);
            },
        });

        // blockImageDescription //

        conversion.for('upcast').elementToElement({
            model: 'blockImageDescription',
            view: {
                name: 'div',
                classes: 'block-image-description',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'blockImageDescription',
            view: {
                name: 'img',
                classes: 'block-image-description',
                placeholder: 'Enter description here...',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'blockImageDescription',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement('div', {
                    class: 'block-image-description',
                    placeholder: 'Enter description here...',
                });
                return toWidgetEditable(div, viewWriter);
            },
        });
    }
}
