import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';
import { v4 as uuidV4 } from 'uuid';

// import EnterCommand from './EnterCommand';
// import InsertParagraphCommand from './InsertParagraphCommand';

/* eslint-disable no-underscore-dangle */
export default class NichePlugin extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const { plugins = [] } = this.editor.config.get('niche') || {};
        this.plugins = plugins.map((CustomPlugin) => new CustomPlugin(this.editor));
        this.plugins.forEach((plugin) => plugin.init());

        this.editor.commands.get('enter').on('afterExecute', () => {
            const block = this.editor.model.document.selection.getSelectedBlocks().next().value;
            // console.log('block', block, this.editor.model.document.selection.getSelectedBlocks());
            this.editor.model.change((writer) => {
                writer.removeAttribute('id', block);
                writer.setAttribute('uuid', uuidV4(), block);
            });
        });

        this.editor.commands.get('insertParagraph').on('execute', () => {
            const block = this.editor.model.document.selection.getSelectedBlocks().next().value;
            this.editor.model.change((writer) => {
                writer.removeAttribute('id', block);
                writer.setAttribute('uuid', uuidV4(), block);
            });
        });

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
        // schema.extend('paragraph', {});

        // The paragraph problem
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('paragraph', {
                    tag: viewElement.name,
                    id: null,
                    class: viewElement.parent.getAttribute('class'),
                    uuid:
                        viewElement.parent.parent.getAttribute('data-niche-block-uuid') || uuidV4(),
                    type: 'text',
                    role: 'block',
                    inline: 'true',
                }),
            view: {
                name: 'p',
                // attributes: {
                //     'data-niche-block-type': 'text',
                // },
            },
            converterPriority: 'high',
        });

        conversion.for('editingDowncast').attributeToAttribute({
            view: {
                name: 'p',
                key: 'class',
            },
            model: {
                name: 'paragraph',
                key: 'class',
            },
        });

        conversion.for('downcast').attributeToAttribute({
            view: {
                key: 'data-niche-block-uuid',
            },
            model: {
                key: 'uuid',
            },
        });

        /**
         * Niche inline blocks
         */
        // conversion.for('upcast').elementToElement({
        //     model: (viewElement, { writer: modelWriter }) => {
        //         const blockContainer = viewElement;
        //         const block = blockContainer.getChild(0);
        //         return modelWriter.createElement('nicheBlockInline', {
        //             tag: block.name,
        //             class: block.getAttribute('class'),
        //             id: blockContainer.getAttribute('data-niche-block-id') || null,
        //             uuid: blockContainer.getAttribute('data-niche-block-uuid'),
        //             type: blockContainer.getAttribute('data-niche-block-type'),
        //             inline: 'true',
        //             role: 'block',
        //         });
        //     },
        //     view: {
        //         attributes: {
        //             'data-niche-block-inline': 'true',
        //         },
        //     },
        // });

        // conversion.for('dataDowncast').elementToElement({
        //     model: 'nicheBlockInline',
        //     view: (modelElement, { writer: viewWriter }) => {
        //         const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
        //             id: modelElement.getAttribute('uuid'),
        //             class: modelElement.getAttribute('class'),
        //             'data-niche-block-id': modelElement.getAttribute('id') || null,
        //             'data-niche-block-uuid': modelElement.getAttribute('uuid'),
        //             'data-niche-block-type': modelElement.getAttribute('type'),
        //             'data-niche-block-inline': 'true',
        //             'data-niche-role': modelElement.getAttribute('role'),
        //         });
        //         return block;
        //     },
        // });

        // conversion.for('editingDowncast').elementToElement({
        //     model: 'nicheBlockInline',
        //     view: (modelElement, { writer: viewWriter }) => {
        //         const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
        //             id: modelElement.getAttribute('uuid'),
        //             class: modelElement.getAttribute('class'),
        //             'data-niche-block-id': modelElement.getAttribute('id') || null,
        //             'data-niche-block-uuid': modelElement.getAttribute('uuid'),
        //             'data-niche-block-type': modelElement.getAttribute('type'),
        //             'data-niche-role': modelElement.getAttribute('role'),
        //             'data-niche-block-inline': 'true',
        //         });
        //         return block;
        //     },
        // });

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
                    id: blockContainer.getAttribute('data-niche-block-id') || null,
                    uuid: blockContainer.getAttribute('data-niche-block-uuid'),
                    type: blockContainer.getAttribute('data-niche-block-type'),
                    role: 'block',
                });
            },
            view: {
                attributes: {
                    // 'data-niche-block-widget': 'true',
                    'data-niche-block-type': /.*/,
                    'data-niche-block-inline': 'false',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    id: modelElement.getAttribute('uuid'),
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-widget': modelElement.getAttribute('widget'),
                    'data-niche-block-id': modelElement.getAttribute('id') || null,
                    'data-niche-block-uuid': modelElement.getAttribute('uuid'),
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
                    id: modelElement.getAttribute('uuid'),
                    class: modelElement.getAttribute('class'),
                    'data-niche-block-widget': widget,
                    'data-niche-block-id': modelElement.getAttribute('id') || null,
                    'data-niche-block-uuid': modelElement.getAttribute('uuid'),
                    'data-niche-block-type': modelElement.getAttribute('type'),
                    'data-niche-role': modelElement.getAttribute('role'),
                });
                return widget ? toWidget(block, viewWriter) : block;
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
