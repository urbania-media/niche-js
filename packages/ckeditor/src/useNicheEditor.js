// import { ClickObserver } from '@ckeditor/ckeditor5-engine';
import { FocusObserver } from '@ckeditor/ckeditor5-engine';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { useEffect, useRef, useState } from 'react';

import NicheEditor from '@niche-js/ckeditor/build';

function useNicheEditor({
    body,
    onChange = null,
    onClick = null,
    onFocus = null,
    onRequestImageChange = null,
    onRequestPicker = null,
    onRequestRemove = null,
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

                editor.setData(body);

                if (debug) {
                    CKEditorInspector.attach(editor);
                }

                // editor.editing.view.document.on('change:isFocused', (evt, data, isFocused) => {
                //     // if (!isFocused) {
                //     //     evt.stop();
                //     // }
                //     console.log(`View document is focused: ${isFocused}. - ${body}`, evt, data);
                //     console.log('document focus', editor.editing.view.document.isFocused);
                // });

                // const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');
                // Disable the widget type around plugin.
                // widgetTypeAroundPlugin.forceDisabled('WidgetTypeAround');

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
        currentEditor.editing.view.document.on('change:isFocused', finalOnFocus);
        return () => {
            currentEditor.editing.view.document.off('change:isFocused', finalOnFocus);
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

    useEffect(() => {
        const { current: currentEditor = null } = editorRef || {};
        if (!ready || currentEditor === null) {
            return () => {};
        }

        const observer = currentEditor.editing.view.getObserver(FocusObserver);
        const onBlur = () => {
            observer.document.isFocused = false;
            // eslint-disable-next-line no-underscore-dangle
            observer._isFocusChanging = false;
            observer.view.change(() => {});
        };
        observer.document.on('blur', onBlur);

        return () => {
            observer.document.off('blur', onBlur);
        };
    }, [ready]);

    useEffect(() => {
        const { current: currentEditor = null } = editorRef || {};
        if (!ready || currentEditor === null) {
            return () => {};
        }
        // eslint-disable-next-line no-param-reassign
        currentEditor.onRequestImageChange = onRequestImageChange;
        // eslint-disable-next-line no-param-reassign
        currentEditor.onRequestPicker = onRequestPicker;
        // eslint-disable-next-line no-param-reassign
        currentEditor.onRequestRemove = onRequestRemove;
        return () => {};
    }, [ready, onRequestImageChange, onRequestPicker, onRequestRemove]);

    return { containerRef, editor: editorRef.current };
}

export default useNicheEditor;
