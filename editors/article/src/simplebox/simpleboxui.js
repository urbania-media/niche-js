// simplebox/simpleboxui.js
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

export default class SimpleBoxUI extends Plugin {
    init() {
        console.log('SimpleBoxUI#init() got called');

        const editor = this.editor;
        const t = editor.t;

        // The "simpleBox" button must be registered among the UI components of the editor
        // to be displayed in the toolbar.

        editor.ui.componentFactory.add('simpleBox', (locale) => {
            // The state of the button will be bound to the widget command.
            const command = editor.commands.get('insertSimpleBox');

            // The button will be an instance of ButtonView.
            const buttonView = new ButtonView(locale);

            buttonView.set({
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t('Add Block'),
                withText: true,
                tooltip: true,
            });

            // Bind the state of the button to the command.
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            // Execute the command when the button is clicked (executed).
            this.listenTo(buttonView, 'execute', () => editor.execute('insertSimpleBox'));

            return buttonView;
        });

        // const toolbarOptions = editor.config.get('simpleBox.toolbar');

        // toolbarOptions.forEach((option) => {
        //     console.log(option);
        //     console.log('xxxxxxxxx');

        //     editor.ui.componentFactory.add(option, (locale) => {
        //         console.log('zxx');

        //         const view = new ButtonView(locale);

        //         console.log();

        //         view.set({
        //             label: option,
        //             withText: true,
        //             // Depending on the option, the icon could be different
        //             icon: option === 'bold' ? 'bold' : 'italic',
        //         });

        //         // Bind the button model to the command
        //         view.bind('isOn', 'isEnabled').to(this.editor.commands.get(option));

        //         // Execute the command when the button is clicked (imagine a user clicks on "bold")
        //         view.on('execute', () => {
        //             editor.execute(option);
        //             editor.editing.view.focus();
        //         });

        //         console.log(view);

        //         return view;
        //     });
        // });
    }
}
