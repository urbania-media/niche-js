/* eslint-disable react/jsx-props-no-spreading */
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { ComponentsProvider } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';

import NicheEditor from '@niche-js/ckeditor/build';
import {
    EditorProvider,
    useViewerComponent,
    useBlocksComponentsManager,
    BLOCKS_NAMESPACE,
    HEADERS_NAMESPACE,
    useHeadersComponentsManager,
} from '@niche-js/core/contexts';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({
        components: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    viewer: PropTypes.string,
    onEditorChange: PropTypes.func,
    onEditorClick: PropTypes.func,
    viewerProps: PropTypes.shape({}),
    onChange: PropTypes.func,
    config: PropTypes.shape({}),
    debug: PropTypes.bool,
    locked: PropTypes.bool,
    className: PropTypes.string,
};

const defaultProps = {
    document: null,
    viewer: null,
    onEditorChange: null,
    onEditorClick: null,
    viewerProps: null,
    onChange: null,
    config: {},
    debug: false,
    locked: false,
    className: null,
};

function Editor({
    document,
    viewer,
    onEditorChange,
    onEditorClick,
    viewerProps,
    onChange,
    config,
    debug,
    locked,
    className,
}) {
    const { type = null } = document || {};
    const editorRef = useRef(null);
    const nicheEditorRef = useRef(null);
    const documentRef = useRef(document);

    useEffect(() => {
        documentRef.current = document;
    }, [document]);

    const ViewerComponent = useViewerComponent(viewer || type || 'article');

    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();

    const headersManager = useHeadersComponentsManager();
    const headers = headersManager.getComponents();

    const previousBody = useRef(null);
    const body = useMemo(
        () =>
            renderToString(
                <EditorProvider>
                    <ComponentsProvider namespace={HEADERS_NAMESPACE} components={headers}>
                        <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                            <ViewerComponent document={document} {...viewerProps} />
                        </ComponentsProvider>
                    </ComponentsProvider>
                </EditorProvider>,
            ),
        [document, viewerProps],
    );

    // console.log('body', body);

    useEffect(() => {
        const editor = nicheEditorRef.current;
        if (editor !== null && previousBody.current !== body) {
            previousBody.current = body;
            const { selection: currentSelection = null } = editor.editing.model.document || {};
            const range = currentSelection.getFirstRange();
            editor.setData(body);
            editor.model.change((writer) => {
                try {
                    // console.log('focus state', editor.editing.view.document.isFocused);
                    // if (!editor.editing.view.document.isFocused) {
                    // editor.editing.view.focus();
                    // }
                    writer.setSelection(range);
                } catch (e) {
                    console.log('failed to focus on range', e, range);
                }
            });
        }
    }, [body, onChange]);

    useEffect(() => {
        if (nicheEditorRef.current === null && editorRef.current !== null) {
            NicheEditor.create(editorRef.current, config || null)
                .then((editor) => {
                    // console.log('Editor was initialized', editor, body);
                    editor.setData(body);

                    const modelDocument = editor.model.document;

                    modelDocument.on('change:data', (event) => {
                        const data = editor.getData();
                        const finalData = data !== '' ? data : null;
                        console.log('change data normie', finalData);
                        return onEditorChange(event, finalData);
                    });

                    const viewDocument = editor.editing.view.document;
                    viewDocument.on('click', (event) => onEditorClick(event, editor));

                    if (debug) {
                        CKEditorInspector.attach(editor);
                    }

                    if (locked) {
                        const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');
                        widgetTypeAroundPlugin.forceDisabled('Niche');
                    }

                    nicheEditorRef.current = editor;
                })
                .catch((error) => {
                    console.error(error.stack);
                });
        }
        return () => {
            if (nicheEditorRef.current) {
                nicheEditorRef.current.destroy();
                nicheEditorRef.current = null;
            }
        };
    }, [config, debug, locked, onEditorChange, onEditorClick]);

    // console.log('body', body);

    return (
        <div className={classNames([styles.ckEditor, { [className]: className !== null }])}>
            <div ref={editorRef} />
        </div>
    );
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
