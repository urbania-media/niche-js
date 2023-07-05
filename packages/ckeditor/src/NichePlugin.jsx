import { Plugin } from '@ckeditor/ckeditor5-core';

/* eslint-disable no-underscore-dangle */
export default class NichePlugin extends Plugin {
    init() {
        //  console.log('On demand plugins#init() got called');
        const { plugins = [] } = this.editor.config.get('niche') || {};
        this.plugins = plugins.map((CustomPlugin) => new CustomPlugin(this.editor));
        this.plugins.forEach((plugin) => plugin.init());
    }
}
