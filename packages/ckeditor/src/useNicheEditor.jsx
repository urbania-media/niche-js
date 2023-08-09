/* eslint-disable react/jsx-props-no-spreading */
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { useEffect, useRef } from 'react';

import NicheEditor from './build';

function useNicheEditor({
    body,

    onChange = null,
    onClick = null,
    debug = false,
    locked = false,
}) {
    const editorRef = useRef(null);
    const nicheEditorRef = useRef(null);
    const previousBody = useRef(null);

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
    }, [body]);

    useEffect(() => {
        if (nicheEditorRef.current === null && editorRef.current !== null) {
            NicheEditor.create(editorRef.current)
                .then((editor) => {
                    // console.log('Editor was initialized', editor, body);

                    editor.setData(body);

                    if (onChange !== null) {
                        const modelDocument = editor.model.document;
                        modelDocument.on('change:data', (event) => {
                            console.log('change data');
                            return onChange(event, editor);
                        });
                    }

                    if (onClick !== null) {
                        const viewDocument = editor.editing.view.document;
                        viewDocument.on('click', (event) => {
                            console.log('clikkk', event);
                            onClick(event, editor);
                        });
                    }

                    if (debug) {
                        CKEditorInspector.attach(editor);
                    }

                    // if (locked) {
                    //     const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');
                    //     widgetTypeAroundPlugin.forceDisabled('Niche');
                    // }

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
    }, [debug, locked, onChange, onClick]);

    return editorRef;
}

export default useNicheEditor;
