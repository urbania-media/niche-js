// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import NicheEditor from '@niche-js/ckeditor';

import styles from './styles.module.css';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    body: null,
    className: null,
    onChange: null,
};

function EditorArticle({ body, className, onChange }) {
    const onEditorReady = useCallback((editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
    }, []);
    const onEditorChange = useCallback(
        (event, editor) => {
            const data = editor.getData();
            if (onChange !== null) {
                onChange(data);
            }
        },
        [onChange],
    );
    const onEditorFocus = useCallback((event, editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Focus', event);
    }, []);
    const onEditorBlur = useCallback((event, editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Blur', event);
    }, []);
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <CKEditor
                editor={NicheEditor}
                data={body}
                onReady={onEditorReady}
                onChange={onEditorChange}
                onFocus={onEditorFocus}
                onBlur={onEditorBlur}
            />
        </div>
    );
}
EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
