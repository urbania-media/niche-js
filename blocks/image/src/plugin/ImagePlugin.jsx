import { Plugin } from '@ckeditor/ckeditor5-core';

import ImagePluginEditing from './ImagePluginEditing';
import ImagePluginUI from './ImagePluginUI';

export default class ImagePlugin extends Plugin {
    static get requires() {
        return [ImagePluginEditing, ImagePluginUI];
    }
}
