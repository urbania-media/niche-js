import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BalloonEditor } from '@ckeditor/ckeditor5-editor-balloon';
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
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
// import Image from '@ckeditor/ckeditor5-image/src/image';
// import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { BlockToolbar } from '@ckeditor/ckeditor5-ui';

// import { Style } from '@ckeditor/ckeditor5-style';
// import BlockText from './plugins/blocktext';
// import BlockImage from './plugins/image/blockimage';
// import SimpleBox from './simplebox/simplebox';

class NicheEditor extends BalloonEditor {}

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
    blockToolbar: ['bold'],
    // toolbar: ['bold', 'italic'],

    image: {
        toolbar: ['toggleImageCaption'],
    },
};

export default NicheEditor;
