import { Plugin } from '@ckeditor/ckeditor5-core';
import { Model, addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui';
import { Collection } from '@ckeditor/ckeditor5-utils';

function getDropdownItemsDefinitions(dropdownNames) {
    const itemDefinitions = new Collection();

    dropdownNames.forEach((name) => {
        const definition = {
            type: 'button',
            model: new Model({
                commandParam: name,
                label: name,
                withText: true,
            }),
        };

        // Add the item definition to the collection.
        itemDefinitions.add(definition);
    });

    return itemDefinitions;
}

export default class NicheDropdownUI extends Plugin {
    init() {
        const { editor } = this;
        const { t } = editor;
        const dropdownNames = ['John', 'Paul', 'George', 'Ringo'];

        // The "dropdown" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('dropdown', (locale) => {
            const dropdownView = createDropdown(locale);

            // Populate the list in the dropdown with items.
            addListToDropdown(dropdownView, getDropdownItemsDefinitions(dropdownNames));

            dropdownView.buttonView.set({
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t('Dropdown'),
                tooltip: true,
                withText: true,
            });

            // Disable the dropdown button when the command is disabled.
            const command = editor.commands.get('dropdown');
            dropdownView.bind('isEnabled').to(command);

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo(dropdownView, 'execute', (evt) => {
                editor.execute('dropdown', { value: evt.source.commandParam });
                // editor.editing.view.focus();
            });

            // this.listenTo(dropdownView, 'change:isOpen', (evt) => {
            //     console.log('render', evt);
            // });

            // this.listenTo(dropdownView.buttonView, 'open', (evt) => {
            //     console.log('open', evt, dropdownView);
            //     dropdownView.listView = new ListView(locale);

            //     addListToDropdown(dropdownView, getDropdownItemsDefinitions(['Paul', 'Jean']));
            // });

            // this.listenTo(dropdownView.focusTracker, 'change', (evt) => {
            //     console.log('change', evt);
            //     const { selection } = editor.model.document;
            //     console.log('selection', selection);
            //     const viewElement = selection.getSelectedElement();
            //     console.log('ve', viewElement);
            // });

            // this.listenTo(editor.ui.tooltipManager.balloonPanelView, 'render', (evt) => {
            //     console.log('balloon', evt);
            // });

            // console.log('dropdownView', dropdownView);

            return dropdownView;
        });
    }
}
