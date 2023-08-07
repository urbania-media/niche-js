import { Plugin } from '@ckeditor/ckeditor5-core';
import {
    upcastImageFigure,
    downcastImageAttribute,
    downcastSrcsetAttribute,
} from '@ckeditor/ckeditor5-image/src/image/converters';
import {
    getImgViewElementMatcher, // createBlockImageViewElement,
} from '@ckeditor/ckeditor5-image/src/image/utils';
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
                this.editor.model.document.selection.getSelectedBlocks().next()?.value || null;
            if (block !== null) {
                this.editor.model.change((writer) => {
                    writer.removeAttribute('id', block);
                    writer.setAttribute('uuid', uuidV4(), block);
                });
            }
        });

        this.editor.commands.get('insertParagraph').on('execute', () => {
            const block =
                this.editor.model.document.selection.getSelectedBlocks().next()?.value || null;
            if (block !== null) {
                this.editor.model.change((writer) => {
                    writer.removeAttribute('id', block);
                    writer.setAttribute('uuid', uuidV4(), block);
                });
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

        // Extend base schema?
        // schema.extend('paragraph', {});

        // The paragraph/heading problem
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                // NOTE: Headings are truly fucked in ckeditor
                //  h2 -> h1, h3 -> h2, etc.
                let heading = 'paragraph';
                switch (viewElement.name) {
                    case 'h1':
                    case 'h2':
                        heading = 'heading1';
                        break;
                    case 'h3':
                        heading = 'heading2';
                        break;
                    case 'h4':
                        heading = 'heading3';
                        break;
                    case 'h5':
                    case 'h6':
                    case 'paragraph':
                        // Converts back to paragraph (w/ dropdown)
                        heading = 'paragraph';
                        break;
                    default:
                        break;
                }
                const isParagraph = heading === 'paragraph';
                const parent = viewElement?.parent?.parent || null;
                const id = parent !== null ? parent.getAttribute('data-niche-id') || null : null;
                const uuid =
                    parent !== null ? parent.getAttribute('data-niche-uuid') || null : null;
                return modelWriter.createElement(heading, {
                    tag: heading,
                    id,
                    class: !isParagraph ? viewElement.parent.getAttribute('class') || null : null,
                    uuid,
                    type: !isParagraph ? 'heading' : 'text',
                    role: 'block',
                    inline: 'true',
                });
            },
            view: (element) => {
                const match = element.name.match(/^h[(1|2|3|4|5|6)]/);
                if (element.name === 'p' || match !== null) {
                    const blockParent = element?.parent?.parent || null;
                    if (
                        blockParent !== null &&
                        blockParent.getAttribute('data-niche-role') === 'block' &&
                        (blockParent.getAttribute('data-niche-type') === 'heading' ||
                            blockParent.getAttribute('data-niche-type') === 'text')
                    ) {
                        return { name: true };
                    }
                }
                return null;
            },
            converterPriority: 'high',
        });

        conversion.for('downcast').attributeToAttribute({
            view: {
                name: /^h[1-6]/,
                key: 'class',
            },
            model: {
                key: 'class',
            },
        });

        conversion.for('downcast').attributeToAttribute({
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

        // Images
        schema.extend('imageBlock', {
            inheritAllFrom: '$blockObject',
            allowAttributes: ['key', 'class', 'alt', 'src', 'srcset', 'data-image'],
        });

        /**
         * Niche blocks
         */
        conversion.for('upcast').elementToElement({
            view: {
                attributes: {
                    'data-niche-role': 'block',
                    'data-niche-type': true,
                    'data-niche-inline': 'false', // To avoid clashing with p and headings
                },
            },
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
         * Niche inline editable tags
         */
        conversion.for('upcast').elementToElement({
            view: {
                attributes: {
                    'data-niche-editable-inline': true,
                },
            },
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheEditableInline', {
                    tag: viewElement.name,
                    class: viewElement.getAttribute('class'),
                    key: viewElement.getAttribute('data-niche-editable-inline'),
                }),
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
            view: {
                attributes: {
                    'data-niche-editable': /.+/,
                },
            },
            model: (viewElement, { writer: modelWriter }) =>
                modelWriter.createElement('nicheEditable', {
                    tag: viewElement.name,
                    class: viewElement.getAttribute('class'),
                    key: viewElement.getAttribute('data-niche-editable'),
                }),
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

        /**
         * Niche image editables
         */

        const imageUtils = this.editor.plugins.get('ImageUtils');
        conversion
            .for('upcast')
            .elementToElement({
                view: getImgViewElementMatcher(this.editor, 'imageBlock'),
                model: (viewImage, { writer: modelWriter }) =>
                    modelWriter.createElement('imageBlock', {
                        src: viewImage.getAttribute('src') || null,
                        alt: viewImage.getAttribute('alt') || null,
                        class: viewImage.getAttribute('class'),
                        key: viewImage.getAttribute('data-niche-editable-image'),
                        id: 'image-block-id',
                    }),
                converterPriority: 'high',
            })
            .add(upcastImageFigure(imageUtils));

        conversion
            .for('downcast')
            .add(downcastImageAttribute(imageUtils, 'imageBlock', 'src'))
            .add(downcastImageAttribute(imageUtils, 'imageBlock', 'alt'))
            .add(downcastImageAttribute(imageUtils, 'imageBlock', 'class'))
            .add(downcastImageAttribute(imageUtils, 'imageBlock', 'key')) // aka data-niche-editable-image
            .add(downcastSrcsetAttribute(imageUtils, 'imageBlock'));

        // conversion.for( 'editingDowncast' )
        //     .elementToStructure( {
        //             model: 'imageBlock',
        //             view: ( modelElement, { writer } ) => imageUtils.toImageWidget(
        //                     createBlockImageViewElement( writer ), writer, t( 'image widget' )
        //             )
        //     } );

        // conversion.for( 'downcast' )
        //     .add( downcastImageAttribute( imageUtils, 'imageBlock', 'src' ) )
        //     .add( downcastImageAttribute( imageUtils, 'imageBlock', 'alt' ) )
        //     .add( downcastSrcsetAttribute( imageUtils, 'imageBlock' ) );
    }

    // findBlockNode(node) {
    //     const type = node.getAttribute('data-niche-type') || null;
    //     if (type !== null) {
    //         return node;
    //     }
    //     const parent = node.parent || null;
    //     return parent !== null ? this.findBlockNode(node.parent) : null;
    // }
}
