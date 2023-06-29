import { Plugin } from '@ckeditor/ckeditor5-core';
import BlocksPluginEditing from './BlocksPluginEditing';
import BlocksPluginUi from './BlocksPluginUi';

export default class BlocksPlugin extends Plugin {
    static get requires() {
        return [BlocksPluginEditing, BlocksPluginUi];
    }
}
