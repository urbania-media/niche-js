// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Editor from './ckeditor';

// import NicheEditor from '@niche-js/ckeditor/build';
// import NicheBlocksPlugin from './NicheBlocksPlugin';
import styles from './styles.module.css';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

// ClassicEditor.defaultConfig = {
//     toolbar: {
//         items: [
//             'heading',
//             '|',
//             'alignment', // <--- ADDED
//             'bold',
//             'italic',
//             'link',
//             'bulletedList',
//             'numberedList',
//             'uploadImage',
//             'blockQuote',
//             'undo',
//             'redo',
//         ],
//     },
//     image: {
//         toolbar: [
//             'imageStyle:inline',
//             'imageStyle:block',
//             'imageStyle:side',
//             '|',
//             'toggleImageCaption',
//             'imageTextAlternative',
//         ],
//     },
//     // This value must be kept in sync with the language defined in webpack.config.js.
//     language: 'en',
// };

// console.log(NicheEditor);

const EditorArticle = ({ body, className }) => (
    <div className={classNames([styles.container, { [className]: className !== null }])}>
        Art Editor...
        <CKEditor
            editor={Editor}
            // config={{ extraPlugins: [NicheBlocksPlugin] }}
            data="<p>Hello from CKEditor 5!</p>"
            onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
                console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
                console.log('Focus.', editor);
            }}
        />
    </div>
);
EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
