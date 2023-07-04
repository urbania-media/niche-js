import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

import InsertBlockCommand from './InsertBlockCommand';

/* eslint-disable no-underscore-dangle */
export default class BlocksPluginEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        console.log('SimpleBoxEditing#init() got called');

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertBlock', new InsertBlockCommand(this.editor));
    }

    _defineSchema() {
        const { schema } = this.editor.model;

        schema.register('nicheBlock', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            inheritAllFrom: '$blockObject',
            // isObject: true,

            allowAttributes: ['type', 'data'],
        });

        schema.register('nicheBlockInline', {
            isLimit: true,

            allowIn: 'nicheBlock',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$block',
            attributes: ['tagName'],
        });

        schema.register('nicheBlockEditable', {
            isLimit: true,

            allowIn: 'nicheBlock',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root',
        });
    }

    _defineConverters() {
        const { conversion } = this.editor;

        const config = this.editor.config.get('niche') || {};
        const { blockRenderer: renderBlock } = config;

        // <simpleBox> converters
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheBlock', {
                    type: viewElement.getAttribute('data-block-type'),
                    data: viewElement.getAttribute('data-block-data'),
                }),
            view: {
                name: 'div',
                attributes: {
                    'data-block': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement('div', {
                    class: 'niche-block',
                    'data-block': 'true',
                    'data-block-type': modelElement.getAttribute('type'),
                });

                return block;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement('div', {
                    class: 'niche-block',
                    'data-block': 'true',
                    'data-block-type': modelElement.getAttribute('type'),
                });

                const type = modelElement.getAttribute('type');
                const data = modelElement.getAttribute('data');
                const jsonData = data ? JSON.parse(data) : null;

                const reactWrapper = viewWriter.createRawElement(
                    'div',
                    {
                        class: 'block__react-wrapper',
                    },
                    (domElement) => {
                        renderBlock(type, jsonData, domElement);
                    },
                );

                viewWriter.insert(viewWriter.createPositionAt(block, 0), reactWrapper);

                return toWidget(block, viewWriter, { label: 'Block' });
            },
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheBlockInline', {
                    tagName: viewElement.name,
                }),
            view: {
                attributes: {
                    'data-block-inline': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlockInline',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement(modelElement.getAttribute('tagName'), {
                    'data-block-inline': 'true',
                });

                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlockInline',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement(modelElement.getAttribute('tagName'), {
                    'data-block-inline': 'true',
                });
                // return div;

                return toWidgetEditable(div, viewWriter);
            },
        });

        conversion.for('upcast').elementToElement({
            model: 'nicheBlockEditable',
            view: {
                name: 'div',
                attributes: {
                    'data-block-editable': 'true',
                },
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlockEditable',
            view: {
                name: 'div',
                attributes: {
                    'data-block-editable': 'true',
                },
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlockEditable',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', {
                    'data-block-editable': 'true',
                });

                div.on('change:isFocused', (evt, args) => {
                    console.log('hella', evt, args);
                });

                console.log('my div', div);

                return toWidgetEditable(div, viewWriter);
            },
        });
    }
}
