import { Plugin } from '@ckeditor/ckeditor5-core';

import BlockImageEditing from './blockimageediting';
import BlockImageUI from './blockimageui';

export default class BlockImage extends Plugin {
    static get requires() {
        return [BlockImageEditing, BlockImageUI];
    }
}
