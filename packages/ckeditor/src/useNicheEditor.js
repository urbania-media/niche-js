import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { useEffect, useRef, useState } from 'react';

import NicheEditor from './build';

function useNicheEditor({ body, onChange = null, onClick = null, debug = false }) {
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

        NicheEditor.create(currentContainer)
            .then((editor) => {
                console.log('Editor was initialized', editor, body);

                editor.setData(body);

                if (debug) {
                    CKEditorInspector.attach(editor);
                }

                editorRef.current = editor;
                setReady(true);
            })
            .catch((error) => {
                console.error(error.stack);
                setReady(false);
            });

        return () => {
            editorRef.current.destroy();
            editorRef.current = null;
            setReady(false);
        };
    }, [debug, onChange, onClick]);

    useEffect(() => {
        const { current: currentEditor = null } = editorRef || {};
        if (!ready || currentEditor === null || onClick === null) {
            return () => {};
        }

        const finalOnClick = (event) => {
            console.log('onClick', event);
            onClick(event, currentEditor);
        };
        const viewDocument = currentEditor.editing.view.document;

        console.log('viewDocument', viewDocument);
        // viewDocument.on('click', finalOnClick);

        currentEditor.listenTo(viewDocument, 'click', (evt, data) => {
            const modelElement = currentEditor.editing.mapper.toModelElement(data.target);
            console.log('meeee', modelElement);
            // if (modelElement.name == 'placeholder') {
            //     console.log('Placeholder has been clicked.');
            // }
        });

        return () => {
            viewDocument.off('click', finalOnClick);
        };
    }, [onClick, ready]);

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
