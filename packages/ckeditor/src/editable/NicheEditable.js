import { Plugin } from '@ckeditor/ckeditor5-core';

import NicheDeleteCommand from './NicheDeleteCommand';
import NicheDeleteUI from './NicheDeleteUI';
import NicheEditCommand from './NicheEditCommand';
import NicheEditUI from './NicheEditUI';

export default class NicheEditable extends Plugin {
    static get requires() {
        return [NicheEditUI, NicheDeleteUI, NicheEditCommand, NicheDeleteCommand];
    }

    init() {
        const { editor } = this;
        editor.commands.add('nicheEdit', new NicheEditCommand(editor));
        editor.commands.add('nicheDelete', new NicheDeleteCommand(editor));
    }
}
