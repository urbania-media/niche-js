import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BalloonEditor as BaseEditor } from '@ckeditor/ckeditor5-editor-balloon';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
    ImageUtils,
    ImageBlock,
    ImageResize,
    ImageToolbar,
    ImageInsert,
    ImageEditing,
} from '@ckeditor/ckeditor5-image';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
// import { RestrictedEditingMode } from '@ckeditor/ckeditor5-restricted-editing';
import { BlockToolbar } from '@ckeditor/ckeditor5-ui';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload';

// import { getCSRFHeaders } from '@folklore/fetch';
import NicheDPPlugin from './NicheDataProcessorPlugin';
import NichePlugin from './NichePlugin';
// import WidgetTypeAround from './WidgetTypeAround';
import NicheEditable from './editable/NicheEditable';
import NicheEditableToolbar from './editable/NicheEditableToolbar';

class NicheEditor extends BaseEditor {}

NicheEditor.builtinPlugins = [
    // WidgetTypeAround,
    NicheDPPlugin,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    List,

    BlockToolbar,
    MediaEmbed,

    ImageUtils,
    ImageBlock,
    ImageResize,
    ImageToolbar,
    ImageInsert,
    ImageEditing,
    // Custom plugins
    NichePlugin,
    NicheEditable,
    NicheEditableToolbar,
    SimpleUploadAdapter,
    Undo,
];

NicheEditor.defaultConfig = {
    // plugins: [WidgetTypeAround],
    toolbar: ['bold', 'italic'],
    blockToolbar: ['heading', 'blocks', 'insertImage', 'mediaEmbed'],
    mediaEmbed: {
        previewsInData: true,
    },
    image: {
        toolbar: ['toggleImageCaption', 'imageTextAlternative'],
    },
    niche: {
        editable: {
            toolbar: ['nicheEdit', 'nicheDelete'],
        },
    },
};

export default NicheEditor;
