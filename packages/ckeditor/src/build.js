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
// import { plugin as ImagePlugin } from '@niche-js/block-image/editor';
import { BlockToolbar } from '@ckeditor/ckeditor5-ui';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload';
import { getCSRFHeaders } from '@folklore/fetch';

import NicheDPPlugin from './NicheDataProcessorPlugin';
import NichePlugin from './NichePlugin';

class NicheEditor extends BaseEditor {}

NicheEditor.builtinPlugins = [
    NicheDPPlugin,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    List,
    ImageBlock,
    ImageEditing,
    ImageToolbar,
    ImageUtils,
    ImageResize,
    ImageInsert,
    BlockToolbar,
    MediaEmbed,
    // Custom plugins
    // ImagePlugin,
    // Blocks
    NichePlugin,
    SimpleUploadAdapter,
    Undo,
];

NicheEditor.defaultConfig = {
    blockToolbar: ['heading', 'blocks', 'insertImage', 'mediaEmbed'],
    toolbar: ['bold', 'italic'],
    mediaEmbed: {
        previewsInData: true,
    },
    simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: 'https://niche.ca.test:8080/medias/upload',
        // Enable the XMLHttpRequest.withCredentials property.
        withCredentials: true,
        // Headers sent along with the XMLHttpRequest to the upload server.
        headers: {
            // 'X-CSRF-TOKEN': 'CSRF-Token',
            // Authorization: 'Bearer <JSON Web Token>',
            ...getCSRFHeaders(),
        },
    },
    image: {
        toolbar: [
            // 'imageStyle:block',
            // 'imageStyle:side',
            '|',
            'toggleImageCaption',
            'imageTextAlternative',
            // {
            //     // Grouping the buttons for the icon-like image styling
            //     // into one drop-down.
            //     name: 'imageStyle:icons',
            //     title: 'Alignment',
            //     items: ['imageStyle:regular', 'imageStyle:blue', 'imageStyle:red'],
            //     defaultItem: 'imageStyle:regular',
            // },
        ],
        // styles: {
        //     // A list of completely custom styling options.
        //     options: [
        //         {
        //             name: 'regular',
        //             modelElements: ['imageBlock', 'imageInline'],
        //             title: 'Regular image',
        //             icon: 'full',
        //             isDefault: true,
        //         },
        //         {
        //             name: 'blue',
        //             modelElements: ['imageInline', 'imageBlock'],
        //             title: 'Blue image',
        //             icon: 'full',
        //             className: 'image-blue',
        //         },
        //     ],
        // },
    },
};

export default NicheEditor;
