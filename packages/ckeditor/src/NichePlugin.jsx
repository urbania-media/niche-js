import { Plugin } from '@ckeditor/ckeditor5-core';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

import ParagraphPluginEditing from './ParagraphPluginEditing';

/* eslint-disable no-underscore-dangle */
export default class NichePlugin extends Plugin {
    // static get requires() {
    //     return [ParagraphPluginEditing];
    // }

    init() {
        //  console.log('On demand plugins#init() got called');
        const { plugins = [] } = this.editor.config.get('niche') || {};
        this.plugins = plugins.map((CustomPlugin) => new CustomPlugin(this.editor));
        this.plugins.forEach((plugin) => plugin.init());

        const { schema } = this.editor.model;
        const { conversion } = this.editor;

        schema.register('nicheBlock', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            inheritAllFrom: '$blockObject',
            // allowContentOf: '$root',
            //    allowWhere : '$block',
            // isObject: true,
            allowChildren: ['$inlineObject'],

            allowAttributes: ['class', 'type'],
        });

        schema.register('nicheInlineEditable', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            allowIn: 'nicheBlock',
            allowContentOf: '$block',
            isLimit: true,

            allowAttributes: ['class', 'key'],
        });

        schema.register('nicheBlockEditable', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            allowIn: 'nicheBlock',
            allowContentOf: '$root',
            isLimit: true,

            allowAttributes: ['class', 'key'],
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheBlock', {
                    class: viewElement.getAttribute('class'),
                    type: viewElement.parent.getAttribute('data-block-type'),
                }),
            view: {
                name: 'div',
                attributes: {
                    'data-niche-block': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement('div', {
                    'data-niche-block': 'true',
                    class: modelElement.getAttribute('class'),
                    'data-block-type': modelElement.getAttribute('type'),
                });

                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', {
                    'data-niche-block': 'true',
                    class: modelElement.getAttribute('class'),
                    'data-block-type': modelElement.getAttribute('type'),
                });

                return toWidget(div, viewWriter);
            },
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheInlineEditable', {
                    class: viewElement.getAttribute('class'),
                    key: viewElement.getAttribute('data-niche-key'),
                }),
            view: {
                name: 'div',
                attributes: {
                    'data-niche-inline-editable': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheInlineEditable',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement('div', {
                    'data-niche-inline-editable': 'true',
                    class: modelElement.getAttribute('class'),
                    'data-niche-key': modelElement.getAttribute('key'),
                });

                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheInlineEditable',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', {
                    'data-niche-inline-editable': 'true',
                    class: modelElement.getAttribute('class'),
                    'data-niche-key': modelElement.getAttribute('key'),
                });

                return toWidgetEditable(div, viewWriter);
            },
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheBlockEditable', {
                    class: viewElement.getAttribute('class'),
                    key: viewElement.getAttribute('data-niche-key'),
                }),
            view: {
                name: 'div',
                attributes: {
                    'data-niche-block-editable': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlockEditable',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement('div', {
                    'data-niche-block-editable': 'true',
                    class: modelElement.getAttribute('class'),
                    'data-niche-key': modelElement.getAttribute('key'),
                });

                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlockEditable',
            view: (modelElement, { writer: viewWriter }) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', {
                    'data-niche-block-editable': 'true',
                    class: modelElement.getAttribute('class'),
                    'data-niche-key': modelElement.getAttribute('key'),
                });

                return toWidgetEditable(div, viewWriter);
            },
        });
    }
}
