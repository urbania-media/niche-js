import { Plugin } from '@ckeditor/ckeditor5-core';

import NicheImageCommand from './NicheImageCommand';

export default class NicheImage extends Plugin {
    static get pluginName() {
        return 'NicheImage';
    }

    init() {
        const { editor } = this;
        editor.commands.add('nicheImage', new NicheImageCommand(editor));
    }
}
