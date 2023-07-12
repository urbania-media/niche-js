import { Plugin } from '@ckeditor/ckeditor5-core';

import NicheDataProcessor from './NicheDataProcessor';

export default class NicheDPPlugin extends Plugin {
    constructor(editor) {
        super(editor);
        editor.data.processor = new NicheDataProcessor(editor.data.viewDocument);
    }
}
