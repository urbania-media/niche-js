// import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Editor from './ckeditor';

import styles from './styles.module.scss';

import data from './article.json';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const EditorCK = ({ body, className }) => {
    const htmlContent = data.components
        .map(({ type, body, image, caption }) => {
            let content = null;
            if (type === 'text') {
                return body;
            }
            if (type === 'image') {
                content = `<div class="block-image-content"><img src="${image.url}" /></div>`;
                content += `<div class="block-image-description">${caption}</div>`;
            }
            return `<div data-block-type="${type}">${content}</div>`;
        })
        .join('');

    console.log('---------------- **** ------');
    console.log(htmlContent);
    console.log('---------------- **** ------');

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <div>
                {/*<div className={styles.header}>
                    <h1 className={styles.title}>CKEditor</h1>
                    <h3 className={styles.subtitle}>
                        Réspectrer les règles sanitaires... la plupart du temps
                    </h3>
                    <h5 className={styles.writer}>Par Hugo Menier</h5>
                </div>
                <div className={styles.image}>
                    <img src="https://picsum.photos/1024" />
                </div>*/}

                <CKEditor
                    editor={Editor}
                    data={htmlContent}
                    onReady={(editor) => {
                        // editor.keystrokes.set('Enter', (data, cancel) => {
                        //     editor.execute('insertBlockText');
                        //     cancel();
                        // });
                        // editor.ui.focusTracker.on('change:isFocused', (evt, data, isFocused) => {
                        //     console.log(`The editor is focused: ${isFocused}.`);
                        //     console.log(data);
                        //     console.log(evt);
                        //     console.log(evt.source._elements);
                        // });
                        // editor.editing.view.document.on(
                        //     'change:isFocused',
                        //     (evt, data, isFocused) => {
                        //         console.log(`View document is focused: ${isFocused}.`);
                        //     },
                        // );
                        // editor.model.document.selection.on('change:range', (eventInfo, data) => {
                        //     const selection = editor.model.document.selection;
                        //     // Check if the selection is on a block.
                        //     const selectedElement = selection.getSelectedElement();
                        //     console.log(selection);
                        //     console.log(selection.anchor);
                        //     console.log(selection.focus);
                        //     if (selectedElement && selectedElement.is('element', 'block')) {
                        //         console.log('A block is focused');
                        //     }
                        // });
                        // console.log('----------------------');
                        // console.log(htmlContent);
                        editor.execute('insertSimpleBox');
                        // editor.execute('insertBlockText');
                        // You can store the "editor" and use when it is needed.
                        // console.log('Editor is ready to use!', editor);
                    }}
                    // onChange={(event, editor) => {
                    onChange={(editor) => {
                        console.log();

                        // const data = editor.getData();
                        // console.log({ event, editor, data });
                    }}
                    onBlur={(editor) => {
                        // console.log('Blur.', editor);
                    }}
                    onFocus={(editor) => {
                        // console.log(editor);
                        // console.log('Focus.', editor.source);
                    }}
                />
            </div>
        </div>
    );
};

EditorCK.propTypes = propTypes;
EditorCK.defaultProps = defaultProps;

export default EditorCK;
