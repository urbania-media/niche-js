import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

import InsertImageCommand from './InsertImageCommand';

/* eslint-disable no-underscore-dangle */
export default class ImagePluginEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        console.log('SimpleBoxEditing#init() got called');

        // const { plugins } = this.editor.config.get('niche') || {};

        // this.plugins = plugins.map((it) => new it());

        this.defineSchema();
        this.defineConverters();

        this.editor.commands.add('insertBlock', new InsertImageCommand(this.editor));
    }

    defineSchema() {
        const { schema } = this.editor.model;

        schema.register('nicheBlockImage', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            inheritAllFrom: '$blockObject',

            allowAttributes: ['type', 'data', 'class'],
        });

        schema.register('nicheImage', {
            isLimit: false,

            allowIn: 'nicheBlockImage',
            isObject: true,
            // Allow content which is allowed in the root (e.g. paragraphs).
            // allowContentOf: '$block',
            allowAttributes: ['url', 'alt', 'class'],
        });

        schema.register('nicheImageCaption', {
            isLimit: true,

            allowIn: 'nicheBlockImage',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$block',
            allowAttributes: ['class'],
        });
    }

    defineConverters() {
        const { conversion } = this.editor;

        const config = this.editor.config.get('niche') || {};
        const { blockRenderer: renderBlock } = config;

        // <simpleBox> converters
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheBlockImage', {
                    class: viewElement.getAttribute('class'),
                }),
            view: {
                name: 'div',
                attributes: {
                    'data-block-image': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlockImage',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement('div', {
                    'data-block-image': 'true',
                    class: modelElement.getAttribute('class'),
                });
                return block;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlockImage',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement('div', {
                    'data-block-image': 'true',
                    class: modelElement.getAttribute('class'),
                });
                return toWidget(block, viewWriter, { label: 'Block' });
            },
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheImage', {
                    url: viewElement.getAttribute('src'),
                    class: viewElement.getAttribute('class'),
                }),
            view: {
                name: 'img',
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheImage',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEmptyElement('img', {
                    src: modelElement.getAttribute('url'),
                    class: modelElement.getAttribute('class'),
                });

                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheImage',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createElement() method here.
                const div = viewWriter.createEmptyElement('img', {
                    src: modelElement.getAttribute('url'),
                    class: modelElement.getAttribute('class'),
                });
                return toWidgetEditable(div, viewWriter);
            },
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheImageCaption', {
                    class: viewElement.getAttribute('class'),
                }),
            view: {
                name: 'div',
                attributes: {
                    'data-caption': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheImageCaption',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement('div', {
                    'data-caption': 'true',
                    class: modelElement.getAttribute('class'),
                });

                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheImageCaption',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', {
                    'data-caption': 'true',
                    class: modelElement.getAttribute('class'),
                });

                return toWidgetEditable(div, viewWriter);
            },
        });
    }
}
