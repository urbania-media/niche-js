import { Plugin, icons } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

import NicheImageCommand from './NicheImageCommand';

const icon = icons.image;

export default class NicheImageUI extends Plugin {
    static get requires() {
        return [NicheImageCommand];
    }

    /**
     * @inheritDoc
     */
    init() {
        const { editor } = this;
        const { t } = editor;

        editor.ui.componentFactory.add('nicheImage', (locale) => {
            const view = new ButtonView(locale);
            const command = editor.commands.get('nicheImage');

            view.label = t('Niche Image');
            view.icon = icon;
            view.tooltip = true;
            view.isToggleable = true;

            view.bind('isEnabled').to(command);
            view.bind('isOn').to(command, 'value');

            view.on('execute', () => {
                console.log('execute niche image command');
                editor.execute('nicheImage');
            });

            return view;
        });
    }
}
