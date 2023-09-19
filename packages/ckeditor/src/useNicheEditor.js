// import { ClickObserver } from '@ckeditor/ckeditor5-engine';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { useEffect, useRef, useState } from 'react';

import NicheEditor from '@niche-js/ckeditor/build';

function useNicheEditor({
    body,
    onChange = null,
    onClick = null,
    onFocus = null,
    debug = false,
    config = null,
}) {
    const [ready, setReady] = useState(false);
    const containerRef = useRef(null);
    const editorRef = useRef(null);
    const previousBody = useRef(null);

    // Updates editor when body has changed from the top
    useEffect(() => {
        const { current: editor = null } = editorRef || {};
        if (editor !== null && previousBody.current !== body) {
            previousBody.current = body;
            const { selection: currentSelection = null } = editor.editing.model.document || {};
            const range = currentSelection.getFirstRange();
            editor.setData(body);
            editor.model.change((writer) => {
                try {
                    writer.setSelection(range);
                    // console.log('set range', range);
                } catch (e) {
                    // console.log('failed to focus on range', e, range);
                }
            });
        }
    }, [body]);

    useEffect(() => {
        const { current: currentEditor = null } = editorRef || {};
        const { current: currentContainer = null } = containerRef || {};
        if (currentEditor !== null || currentContainer === null) {
            return () => {};
        }
        NicheEditor.create(currentContainer, config || {})
            .then((editor) => {
                console.log('Editor was initialized', editor, body);

                // const { view } = editor.editing;
                // view.addObserver(ClickObserver);

                editor.setData(body);

                if (debug) {
                    CKEditorInspector.attach(editor);
                }

                editorRef.current = editor;
                setReady(true);
            })
            .catch((error) => {
                console.error(error);
                setReady(false);
            });
        return () => {
            if (editorRef.current !== null) {
                if (typeof editorRef.current.destroy !== 'undefined') {
                    editorRef.current.destroy();
                }
                editorRef.current = null;
            }
            setReady(false);
        };
    }, [debug, setReady]);

    useEffect(() => {
        const { current: currentEditor = null } = editorRef || {};
        if (!ready || currentEditor === null || onClick === null) {
            return () => {};
        }

        const finalOnClick = (event) => {
            onClick(event, currentEditor);
        };
        const viewDocument = currentEditor.editing.view.document;
        viewDocument.on('click', finalOnClick);
        return () => {
            viewDocument.off('click', finalOnClick);
        };
    }, [onClick, ready]);

    useEffect(() => {
        const { current: currentEditor = null } = editorRef || {};
        if (!ready || currentEditor === null || onFocus === null) {
            return () => {};
        }
        const finalOnFocus = (event) => {
            onFocus(event, currentEditor);
        };
        const modelDocument = currentEditor.model.document;
        modelDocument.on('focus', finalOnFocus);
        return () => {
            modelDocument.off('focus', finalOnFocus);
        };
    }, [onFocus, ready]);

    useEffect(() => {
        const { current: currentEditor = null } = editorRef || {};
        if (!ready || currentEditor === null || onChange === null) {
            return () => {};
        }
        const finalOnChange = (event) => {
            onChange(event, currentEditor);
        };
        const modelDocument = currentEditor.model.document;
        modelDocument.on('change:data', finalOnChange);
        return () => {
            modelDocument.off('change:data', finalOnChange);
        };
    }, [onChange, ready]);

    return { containerRef, editor: editorRef.current };
}

export default useNicheEditor;
