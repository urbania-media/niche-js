import { Plugin, icons } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

import NicheDeleteCommand from './NicheDeleteCommand';

const icon = icons.cancel;

export default class NicheDeleteUI extends Plugin {
    static get requires() {
        return [NicheDeleteCommand];
    }

    /**
     * @inheritDoc
     */
    init() {
        const { editor } = this;
        const { t } = editor;

        editor.ui.componentFactory.add('nicheDelete', (locale) => {
            const view = new ButtonView(locale);
            const command = editor.commands.get('nicheDelete');

            view.label = t('Delete');
            view.icon = icon;
            view.tooltip = true;
            view.isToggleable = true;

            view.bind('isEnabled').to(command);
            view.bind('isOn').to(command, 'value');

            view.on('execute', () => {
                console.log('execute niche delete command');
                editor.execute('nicheDelete');
            });

            return view;
        });
    }
}
