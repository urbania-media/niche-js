import { Plugin } from '@ckeditor/ckeditor5-core';
import {
    Widget,
    toWidget,
    viewToModelPositionOutsideModelElement,
} from '@ckeditor/ckeditor5-widget';

import NicheDropdownCommand from './NicheDropdownCommand';

export default class NicheDropdownEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.defineSchema();
        this.defineConverters();

        this.editor.commands.add('dropdown', new NicheDropdownCommand(this.editor));

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
                viewElement.hasClass('dropdown'),
            ),
        );

        this.editor.config.define('dropdownConfig', {
            types: ['John', 'Paul', 'George', 'Ringo'],
        });
    }

    defineSchema() {
        const { schema } = this.editor.model;

        schema.register('dropdown', {
            // Behaves like a self-contained inline object (e.g. an inline image)
            // allowed in places where $text is allowed (e.g. in paragraphs).
            // The inline widget can have the same attributes as text (for example linkHref, bold).
            inheritAllFrom: '$inlineObject',

            // The dropdown can have many types, like date, name, surname, etc:
            allowAttributes: ['name'],
        });
    }

    defineConverters() {
        const { conversion } = this.editor;

        // Helper method for both downcast converters.
        function createDropdownView(modelItem, viewWriter) {
            const name = modelItem.getAttribute('name');

            const dropdownView = viewWriter.createContainerElement('span', {
                class: 'dropdown',
            });

            // Insert the dropdown name (as a text).
            const innerText = viewWriter.createText(`{${name}}`);
            viewWriter.insert(viewWriter.createPositionAt(dropdownView, 0), innerText);

            return dropdownView;
        }

        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: ['dropdown'],
            },
            model: (viewElement, { writer: modelWriter }) => {
                // Extract the "name" from "{name}".
                const name = viewElement.getChild(0).data.slice(1, -1);
                return modelWriter.createElement('dropdown', { name });
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'dropdown',
            view: (modelItem, { writer: viewWriter }) => {
                const widgetElement = createDropdownView(modelItem, viewWriter);

                // Enable widget handling on a dropdown element inside the editing view.
                return toWidget(widgetElement, viewWriter);
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'dropdown',
            view: (modelItem, { writer: viewWriter }) => createDropdownView(modelItem, viewWriter),
        });
    }
}
