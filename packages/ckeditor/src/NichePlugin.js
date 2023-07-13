import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

/* eslint-disable no-underscore-dangle */
export default class NichePlugin extends Plugin {
    static get requires() {
        return [Widget];
    }

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

            allowChildren: ['$inlineObject', '$blockObject'],

            allowAttributes: ['tag', 'class', 'id', 'type'],
        });

        schema.register('nicheEditableInline', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            allowIn: 'nicheBlock',
            allowContentOf: '$block',
            isLimit: true,

            allowAttributes: ['tag', 'class', 'key'],
        });

        schema.register('nicheEditable', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            allowIn: 'nicheBlock',
            allowContentOf: '$root',
            isLimit: true,

            allowAttributes: ['tag', 'class', 'key'],
        });

        // console.log(schema.getDefinition('paragraph'));
        // schema.extend('paragraph', {
        //     allowAttributes: ['blockId', 'blockType'],
        // });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const blockContainer = this.findBlockNode(viewElement);
                return modelWriter.createElement('paragraph', {
                    blockId: blockContainer.getAttribute('data-niche-block-id'),
                    blockType: blockContainer.getAttribute('data-niche-block-type'),
                });
            },
            view: {
                name: 'p',
            },
            converterPriority: 'high',
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const blockContainer = this.findBlockNode(viewElement);
                return modelWriter.createElement('nicheBlock', {
                    tag: viewElement.name,
                    class: viewElement.getAttribute('class'),
                    id: blockContainer.getAttribute('data-niche-block-id'),
                    type: blockContainer.getAttribute('data-niche-block-type'),
                });
            },
            view: {
                attributes: {
                    'data-niche-block': /.*/,
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                // const div = viewWriter.createContainerElement('div', {
                //     'data-niche-block-id': modelElement.getAttribute('id'),
                //     'data-niche-block-type': modelElement.getAttribute('type'),
                // });
                // const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                //     class: modelElement.getAttribute('class'),
                // });
                // viewWriter.insert(viewWriter.createPositionAt(div, 0), block);
                // return div;
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-id': modelElement.getAttribute('id'),
                    'data-niche-block-type': modelElement.getAttribute('type'),
                });
                return block;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                // const div = viewWriter.createContainerElement('div', {
                //     'data-niche-block-id': modelElement.getAttribute('id'),
                //     'data-niche-block-type': modelElement.getAttribute('type'),
                // });
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-id': modelElement.getAttribute('id'),
                    'data-niche-block-type': modelElement.getAttribute('type'),
                });
                return toWidget(block, viewWriter);
                // viewWriter.insert(viewWriter.createPositionAt(div, 0), block);
                // return toWidget(div, viewWriter);
            },
        });

        /**
         * Niche inline editable
         */
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheEditableInline', {
                    tag: viewElement.name,
                    class: viewElement.getAttribute('class'),
                    key: viewElement.getAttribute('data-niche-editable-inline'),
                }),
            view: {
                attributes: {
                    'data-niche-editable-inline': /.*/,
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheEditableInline',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-editable-inline': modelElement.getAttribute('key'),
                });
                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheEditableInline',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-editable-inline': modelElement.getAttribute('key'),
                });
                return toWidgetEditable(div, viewWriter);
            },
        });

        /**
         * Niche editable
         */
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheEditable', {
                    tag: viewElement.name,
                    class: viewElement.getAttribute('class'),
                    key: viewElement.getAttribute('data-niche-editable'),
                }),
            view: {
                attributes: {
                    'data-niche-editable': /.+/,
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheEditable',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-editable': modelElement.getAttribute('key'),
                });
                return div;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheEditable',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-editable': modelElement.getAttribute('key'),
                });
                return toWidgetEditable(div, viewWriter);
            },
        });
    }

    findBlockNode(node) {
        const type = node.getAttribute('data-niche-block-type') || null;
        if (type !== null) {
            return node;
        }
        const parent = node.parent || null;
        return parent !== null ? this.findBlockNode(node.parent) : null;
    }
}