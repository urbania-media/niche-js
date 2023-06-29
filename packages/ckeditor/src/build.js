import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
// import { ClassicEditor as BaseEditor } from '@ckeditor/ckeditor5-editor-classic';
import { BalloonEditor as BaseEditor } from '@ckeditor/ckeditor5-editor-balloon';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
    AutoImage,
    Image,
    ImageBlock,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
} from '@ckeditor/ckeditor5-image';
import { LinkImage } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { BlockToolbar } from '@ckeditor/ckeditor5-ui';

import BlocksPlugin from './BlocksPlugin';

class NicheEditor extends BaseEditor {}

NicheEditor.builtinPlugins = [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    List,
    // BlockText,
    // BlockImage,
    // SimpleBox,
    BlocksPlugin,
    Image,
    ImageBlock,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    LinkImage,
    AutoImage,
    BlockToolbar,
];

NicheEditor.defaultConfig = {
    simpleBox: {
        toolbar: ['bold'],
    },
    blockToolbar: ['bold', 'blocks'],
    toolbar: ['bold', 'italic'],

    image: {
        toolbar: ['toggleImageCaption'],
    },
};

export default NicheEditor;
