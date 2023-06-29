import { Plugin } from '@ckeditor/ckeditor5-core';

import BlockTextEditing from './blocktextediting';
import BlockTextUI from './blocktextui';

export default class BlockText extends Plugin {
    static get requires() {
        return [BlockTextEditing, BlockTextUI];
    }
}
