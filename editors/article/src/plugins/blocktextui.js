// simplebox/simpleboxui.js
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

export default class BlockTextUI extends Plugin {
    init() {
        console.log('BlockTextUI#init() got called');

        const editor = this.editor;
        const t = editor.t;

        // The "blockText" button must be registered among the UI components of the editor
        // to be displayed in the toolbar.

        editor.ui.componentFactory.add('blockText', (locale) => {
            // The state of the button will be bound to the widget command.
            const command = editor.commands.get('insertBlockText');

            // The button will be an instance of ButtonView.
            const buttonView = new ButtonView(locale);

            buttonView.set({
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t('Block Text'),
                withText: true,
                tooltip: true,
            });

            // Bind the state of the button to the command.
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            // Execute the command when the button is clicked (executed).
            this.listenTo(buttonView, 'execute', () => editor.execute('insertBlockText'));

            return buttonView;
        });
    }
}
