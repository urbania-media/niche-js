import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';

// import { v4 as uuidV4 } from 'uuid';
// import EnterCommand from './EnterCommand';
import InsertParagraphCommand from './InsertParagraphCommand';

/* eslint-disable no-underscore-dangle */
export default class NichePlugin extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const { plugins = [] } = this.editor.config.get('niche') || {};
        this.plugins = plugins.map((CustomPlugin) => new CustomPlugin(this.editor));
        this.plugins.forEach((plugin) => plugin.init());

        this.editor.commands.add('insertParagraph', new InsertParagraphCommand(this.editor));
        // TODO: figure out a way to override the enter and shift enter keys
        // this.editor.editing.view.document.on(
        //     'enter',
        //     (evt, data) => {
        //         console.log('plug', this.editor.plugins.get('CustomEnter'));
        //         // this.editor.execute('shiftEnter');
        //         // Cancel existing event
        //         data.preventDefault();
        //         evt.stop();
        //         console.log(data, evt);
        //     },
        //     { priority: 'high' },
        // );

        const { schema } = this.editor.model;
        const { conversion } = this.editor;

        schema.register('nicheBlockInline', {
            inheritAllFrom: '$container',
            // allowIn: '$root',
            // allowContentOf: '$container',
            // isLimit: false,
            // isObject: true,
            isInline: true,
            isObject: true,
            isContent: false,
            allowChildren: [],
            allowAttributes: ['tag', 'class', 'id', 'type', 'inline'],
        });

        schema.register('nicheBlock', {
            inheritAllFrom: '$container',
            // allowIn: 'root',
            // allowContentOf: '$container',
            // isLimit: false,
            // isObject: true,
            allowChildren: ['$inlineObject', '$blockObject'],
            allowAttributes: ['tag', 'class', 'id', 'type', 'widget'],
        });

        schema.register('nicheEditableInline', {
            allowIn: 'nicheBlock',
            allowContentOf: '$block',
            isLimit: true,
            allowAttributes: ['tag', 'class', 'key'],
        });

        schema.register('nicheEditable', {
            allowIn: 'nicheBlock',
            allowContentOf: '$root',
            isLimit: true,
            allowAttributes: ['tag', 'class', 'key'],
        });

        // TODO: Extend these?
        // schema.extend('paragraph', {});
        schema.extend('imageBlock', {
            allowAttributes: ['alt', 'src', 'srcset', 'data-image'],
        });

        // The paragraph problem
        // conversion.for('upcast').elementToElement({
        //     model: (viewElement, { writer: modelWriter }) => {
        //         console.log('veee', viewElement);
        //         // const blockContainer = viewElement;
        //         // const block = blockContainer.getChild(0);
        //         // return modelWriter.createElement('nicheBlockInline', {
        //         //     tag: block.name,
        //         //     class: block.getAttribute('class'),
        //         //     id: blockContainer.getAttribute('data-niche-block-id'),
        //         //     type: blockContainer.getAttribute('data-niche-block-type'),
        //         //     inline: 'true',
        //         // });
        //     },
        //     view: {
        //         name: 'paragraph',
        //         // attributes: {
        //         //     'data-niche-block-inline': 'true',
        //         // },
        //     },
        //     // converterPriority: 'high',
        // });

        /**
         * Niche inline blocks
         */
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const blockContainer = viewElement;
                const block = blockContainer.getChild(0);
                return modelWriter.createElement('nicheBlockInline', {
                    tag: block.name,
                    class: block.getAttribute('class'),
                    id: blockContainer.getAttribute('data-niche-block-id'),
                    type: blockContainer.getAttribute('data-niche-block-type'),
                    inline: 'true',
                    role: 'block',
                });
            },
            view: {
                attributes: {
                    'data-niche-block-inline': 'true',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlockInline',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-id': modelElement.getAttribute('id'),
                    'data-niche-block-type': modelElement.getAttribute('type'),
                    'data-niche-block-inline': 'true',
                    'data-niche-role': modelElement.getAttribute('role'),
                });
                return block;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlockInline',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-id': modelElement.getAttribute('id'),
                    'data-niche-block-type': modelElement.getAttribute('type'),
                    'data-niche-role': modelElement.getAttribute('role'),
                    'data-niche-block-inline': 'true',
                });
                return block;
            },
        });

        /**
         * Niche blocks
         */
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const blockContainer = viewElement;
                const block = blockContainer.getChild(0);
                const widget = block.getAttribute('data-niche-block-widget') || null;
                return modelWriter.createElement('nicheBlock', {
                    tag: block.name,
                    class: block.getAttribute('class'),
                    widget: widget !== null,
                    id: blockContainer.getAttribute('data-niche-block-id'),
                    type: blockContainer.getAttribute('data-niche-block-type'),
                    role: 'block',
                });
            },
            view: {
                attributes: {
                    // 'data-niche-block-widget': 'true',
                    'data-niche-block-type': /.*/,
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-widget': modelElement.getAttribute('widget'),
                    'data-niche-block-id': modelElement.getAttribute('id'),
                    'data-niche-block-type': modelElement.getAttribute('type'),
                    'data-niche-role': modelElement.getAttribute('role'),
                });
                return block;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                const widget = modelElement.getAttribute('widget');
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-widget': widget,
                    'data-niche-block-id': modelElement.getAttribute('id'),
                    'data-niche-block-type': modelElement.getAttribute('type'),
                    'data-niche-role': modelElement.getAttribute('role'),
                });
                return widget ? toWidget(block, viewWriter) : block;
                // viewWriter.insert(viewWriter.createPositionAt(div, 0), block);
                // return toWidget(div, viewWriter);
            },
        });

        /**
         * Niche inline editable tags
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
         * Niche editable tags
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
