import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import './quill.scss';
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
    let htmlContent = '';

    function parseData(array) {
        array.forEach((obj) => {
            if (obj.type === 'text') {
                htmlContent += obj.body;
            }
        });
    }

    parseData(data.components);

    const handleKeyPress = useCallback((event) => {
        if (event.key === 'Enter') {
            // event.preventDefault();
        }
    }, []);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <div onKeyPress={handleKeyPress}>
                <CKEditor
                    editor={BalloonEditor}
                    data={htmlContent}
                    onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        // console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        // console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                        // console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        // console.log('Focus.', editor);
                    }}
                />
            </div>
        </div>
    );
};

EditorCK.propTypes = propTypes;
EditorCK.defaultProps = defaultProps;

export default EditorCK;
