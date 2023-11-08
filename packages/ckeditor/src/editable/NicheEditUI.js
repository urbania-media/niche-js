import { Plugin, icons } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

import NicheEditCommand from './NicheEditCommand';

const icon = icons.pencil;

export default class NicheEditUI extends Plugin {
    static get requires() {
        return [NicheEditCommand];
    }

    /**
     * @inheritDoc
     */
    init() {
        const { editor } = this;
        const { t } = editor;

        editor.ui.componentFactory.add('nicheEdit', (locale) => {
            const view = new ButtonView(locale);
            const command = editor.commands.get('nicheEdit');

            view.label = t('Edit');
            view.icon = icon;
            view.tooltip = true;
            view.isToggleable = true;

            view.bind('isEnabled').to(command);
            view.bind('isOn').to(command, 'value');

            view.on('execute', () => {
                console.log('execute niche edit command');
                editor.execute('nicheEdit');
            });

            return view;
        });
    }
}
