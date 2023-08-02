import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';
import { v4 as uuidV4 } from 'uuid';

/* eslint-disable no-underscore-dangle */
export default class NichePlugin extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const { plugins = [] } = this.editor.config.get('niche') || {};
        this.plugins = plugins.map((CustomPlugin) => new CustomPlugin(this.editor));
        this.plugins.forEach((plugin) => plugin.init());

        // The commands
        this.editor.commands.get('enter').on('afterExecute', () => {
            const block =
                this.editor.model.document.selection.getSelectedBlocks().next().value || null;
            if (block !== null) {
                this.editor.model.change((writer) => {
                    writer.removeAttribute('id', block);
                    writer.setAttribute('uuid', uuidV4(), block);
                });
            }
        });

        this.editor.commands.get('insertParagraph').on('execute', () => {
            const block =
                this.editor.model.document.selection.getSelectedBlocks().next().value || null;
            if (block !== null) {
                this.editor.model.change((writer) => {
                    writer.removeAttribute('id', block);
                    writer.setAttribute('uuid', uuidV4(), block);
                });
            }
        });

        this.editor.commands.get('delete').on('execute', () => {
            const block =
                this.editor.model.document.selection.getSelectedBlocks().next().value || null;

            if (block !== null) {
                console.log('delete block', block);
                // this.editor.model.change((writer) => {
                //     writer.removeAttribute('id', block);
                //     writer.setAttribute('uuid', uuidV4(), block);
                // });
            }
        });

        const { schema } = this.editor.model;
        const { conversion } = this.editor;

        // The main elements
        schema.register('nicheBlock', {
            inheritAllFrom: '$container',
            allowChildren: ['$inlineObject', '$blockObject'],
            allowAttributes: ['tag', 'class', 'id', 'type', 'role', 'widget'],
        });

        schema.register('nicheHeader', {
            inheritAllFrom: '$container',
            isLimit: true,
            isObject: true,
            allowChildren: ['$inlineObject', '$blockObject'],
            allowAttributes: ['tag', 'class', 'id', 'type', 'role', 'widget'],
        });

        // Editable fields
        schema.register('nicheEditableInline', {
            allowIn: ['nicheBlock', 'nicheHeader'],
            allowContentOf: '$block',
            isLimit: true,
            allowAttributes: ['tag', 'class', 'key'],
        });

        schema.register('nicheEditable', {
            allowIn: ['nicheBlock', 'nicheHeader'],
            allowContentOf: '$root',
            isLimit: true,
            allowAttributes: ['tag', 'class', 'key'],
        });

        // Extend these?
        // schema.extend('paragraph', {});
        schema.extend('imageBlock', {
            allowAttributes: ['alt', 'src', 'srcset', 'data-image'],
        });

        // Inline blocks

        // The paragraph problem
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const id = viewElement?.parent?.parent
                    ? viewElement.parent.parent.getAttribute('data-niche-id') || null
                    : null;
                const uuid = viewElement?.parent?.parent
                    ? viewElement.parent.parent.getAttribute('data-niche-uuid') || null
                    : null;
                return modelWriter.createElement('paragraph', {
                    tag: viewElement.name,
                    id,
                    class: viewElement.parent.getAttribute('class') || null,
                    uuid,
                    type: 'text',
                    role: 'block',
                    inline: 'true',
                });
            },
            view: (element) => {
                if (element.name === 'p') {
                    const blockParent = element?.parent?.parent || null;
                    if (
                        blockParent !== null &&
                        blockParent.getAttribute('data-niche-role') === 'block' &&
                        blockParent.getAttribute('data-niche-type') === 'text'
                    ) {
                        return { name: true };
                    }
                }
                return null;
            },
            converterPriority: 'high',
        });

        // The heading problem
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                // NOTE: Headings are truly fucked in ckeditor
                //  h2 -> h1, h3 -> h2, etc.
                let heading = 'heading1';
                switch (viewElement.name) {
                    case 'h2':
                        heading = 'heading1';
                        break;
                    case 'h3':
                        heading = 'heading2';
                        break;
                    case 'h4':
                        heading = 'heading3';
                        break;
                    default:
                        break;
                }
                const id = viewElement?.parent?.parent
                    ? viewElement.parent.parent.getAttribute('data-niche-id') || null
                    : null;
                const uuid = viewElement?.parent?.parent
                    ? viewElement.parent.parent.getAttribute('data-niche-uuid') || null
                    : null;
                return modelWriter.createElement(heading, {
                    tag: viewElement.name,
                    id,
                    class: viewElement.parent.getAttribute('class') || null,
                    uuid,
                    type: 'heading',
                    role: 'block',
                    inline: 'true',
                });
            },
            view: (element) => {
                const match = element.name.match(/^h[(1|2|3|4|5|6)]/);
                if (match !== null) {
                    const blockParent = element?.parent?.parent || null;
                    if (
                        blockParent !== null &&
                        blockParent.getAttribute('data-niche-role') === 'block' &&
                        blockParent.getAttribute('data-niche-type') === 'heading'
                    ) {
                        return { name: true };
                    }
                }
                return null;
            },
            converterPriority: 'high',
        });

        conversion.for('editingDowncast').attributeToAttribute({
            view: {
                name: /^h[1-6]/,
                key: 'class',
            },
            model: {
                key: 'class',
            },
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

        // Base conversions
        conversion.for('downcast').attributeToAttribute({
            model: {
                key: 'role',
                values: 'block',
            },
            view: {
                key: 'data-niche-role',
            },
        });

        conversion.for('downcast').attributeToAttribute({
            model: {
                key: 'type',
            },
            view: {
                key: 'data-niche-type',
            },
        });

        conversion.for('downcast').attributeToAttribute({
            model: {
                key: 'uuid',
            },
            view: {
                key: 'data-niche-uuid',
            },
        });

        conversion.for('downcast').attributeToAttribute({
            model: {
                key: 'id',
            },
            view: {
                key: 'data-niche-id',
            },
        });

        conversion.for('downcast').attributeToAttribute({
            model: {
                key: 'inline',
            },
            view: {
                key: 'data-niche-block-inline',
                value: 'true',
            },
        });

        /**
         * Niche blocks
         */
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const blockContainer = viewElement;
                const block = blockContainer.getChild(0);
                const widget = block.getAttribute('data-niche-widget') || null;
                return modelWriter.createElement('nicheBlock', {
                    tag: block.name,
                    class: block.getAttribute('class'),
                    widget: widget !== null,
                    id: blockContainer.getAttribute('data-niche-id') || null,
                    uuid: blockContainer.getAttribute('data-niche-uuid'),
                    type: blockContainer.getAttribute('data-niche-type'),
                    role: 'block',
                });
            },
            view: {
                attributes: {
                    'data-niche-role': 'block',
                    'data-niche-type': /.*/,
                    'data-niche-block-inline': 'false',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheBlock',
            view: (modelElement, { writer: viewWriter }) => {
                const block = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    id: modelElement.getAttribute('id'),
                    class: modelElement.getAttribute('class'),
                    'data-niche-widget': modelElement.getAttribute('widget'),
                    'data-niche-id': modelElement.getAttribute('id') || null,
                    'data-niche-uuid': modelElement.getAttribute('uuid'),
                    'data-niche-type': modelElement.getAttribute('type'),
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
                    id: modelElement.getAttribute('id'),
                    class: modelElement.getAttribute('class'),
                    'data-niche-widget': widget,
                    'data-niche-id': modelElement.getAttribute('id') || null,
                    'data-niche-uuid': modelElement.getAttribute('uuid'),
                    'data-niche-type': modelElement.getAttribute('type'),
                    'data-niche-role': modelElement.getAttribute('role'),
                });
                return widget ? toWidget(block, viewWriter) : block;
            },
        });

        /**
         * Niche Headers
         */
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const headerContainer = viewElement;
                const header = headerContainer.getChild(0);
                const widget = header.getAttribute('data-niche-widget') || null;
                // console.log('hello friend!', headerContainer, header);
                return modelWriter.createElement('nicheHeader', {
                    tag: headerContainer.name,
                    class: header.getAttribute('class'),
                    widget: widget !== null,
                    id: headerContainer.getAttribute('data-niche-id') || null,
                    uuid: headerContainer.getAttribute('data-niche-uuid'),
                    type: headerContainer.getAttribute('data-niche-type'),
                    role: 'header',
                });
            },
            view: {
                attributes: {
                    'data-niche-type': true,
                    'data-niche-role': 'header',
                },
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'nicheHeader',
            view: (modelElement, { writer: viewWriter }) => {
                const header = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    id: modelElement.getAttribute('id'),
                    class: modelElement.getAttribute('class'),
                    'data-niche-widget': modelElement.getAttribute('widget'),
                    'data-niche-id': modelElement.getAttribute('id') || null,
                    'data-niche-uuid': modelElement.getAttribute('uuid'),
                    'data-niche-type': modelElement.getAttribute('type'),
                    'data-niche-role': modelElement.getAttribute('role'),
                });
                return header;
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'nicheHeader',
            view: (modelElement, { writer: viewWriter }) => {
                const widget = modelElement.getAttribute('widget');
                const header = viewWriter.createContainerElement(modelElement.getAttribute('tag'), {
                    id: modelElement.getAttribute('id'),
                    class: modelElement.getAttribute('class'),
                    'data-niche-widget': widget,
                    'data-niche-id': modelElement.getAttribute('id') || null,
                    'data-niche-uuid': modelElement.getAttribute('uuid'),
                    'data-niche-type': modelElement.getAttribute('type'),
                    'data-niche-role': modelElement.getAttribute('role'),
                });
                return widget ? toWidget(header, viewWriter) : header;
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
                    'data-niche-editable-inline': true,
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
        const type = node.getAttribute('data-niche-type') || null;
        if (type !== null) {
            return node;
        }
        const parent = node.parent || null;
        return parent !== null ? this.findBlockNode(node.parent) : null;
    }
}
