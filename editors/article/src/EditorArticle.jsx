// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ComponentsProvider } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
// import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import NicheEditor from '@niche-js/ckeditor/build';
import {
    useViewerComponent,
    useBlocksComponentsManager,
    BLOCKS_NAMESPACE,
} from '@niche-js/core/contexts';
import Editor from '@niche-js/editor-editor';

import Outline from './Outline';
import Preview from './Preview';
import Settings from './Settings';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({}),
    viewer: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    document: null,
    viewer: null,
    className: null,
    onChange: null,
};

function findParentBlock(block) {
    const nicheId = block.getAttribute ? block.getAttribute('data-niche-block-uuid') || null : null;
    if (nicheId !== null) {
        // console.log('target', nicheId);
        return nicheId;
    }
    if (block.parent) {
        // console.log('parent', block.parent);
        return findParentBlock(block.parent);
    }
    return null;
}

function EditorArticle({ document, viewer, className, onChange }) {
    const { type = 'article', components = [] } = document || {};
    const [focusedBlock, setFocusedBlock] = useState(null);
    const editorRef = useRef(null);
    const nicheEditorRef = useRef(null);

    const ViewerComponent = useViewerComponent(viewer || type || 'article');
    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();

    // console.log('The Document Value', document);

    const onEditorChange = useCallback(
        (event, editor) => {
            const data = editor.getData();
            if (data && onChange !== null) {
                const { components: newComponents = null } = data || {};
                const nextValue = { ...document, components: newComponents };
                console.log('onChange', nextValue);
                onChange(nextValue);
            }
        },
        [onChange],
    );

    const onFieldChange = useCallback(
        (newValue) => {
            const { uuid: blockUUID = null } = newValue || {};
            const newComponents = components.reduce((acc, comp) => {
                const { uuid = null } = comp || {};
                if (blockUUID !== null && uuid === blockUUID) {
                    return [...acc, newValue];
                }
                return [...acc, comp];
            }, []);
            onChange({ ...document, components: newComponents });
            setFocusedBlock(newValue);
        },
        [onChange, document, focusedBlock],
    );

    const onEditorFocus = useCallback(
        (event, editor) => {
            setTimeout(() => {
                const { selection: currentSelection = null } = editor.editing.view.document || {};
                // const target = event.source.selection.getFirstPosition();
                const range = currentSelection.getFirstRange();
                const target = range.getCommonAncestor();

                if (target !== null) {
                    const blockUUID = findParentBlock(target);
                    if (blockUUID !== null) {
                        const focused =
                            (components || []).find(({ uuid = null }) => uuid === blockUUID) ||
                            null;
                        setFocusedBlock(focused);
                    }
                }
            }, 100);
        },
        [components, setFocusedBlock],
    );

    const onEditorBlur = useCallback(() => {}, [setFocusedBlock]);

    const scrollTo = useCallback((block) => {
        const { uuid: blockUUID = null } = block || {};
        if (blockUUID !== null) {
            const element =
                window.document.querySelector(`[data-niche-block-uuid="${blockUUID}"]`) || null;
            if (element !== null) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        if (blockUUID !== null) {
            const focused =
                (components || []).find(({ uuid = null }) => uuid === blockUUID) || null;
            setFocusedBlock(focused);
        }
    });

    const renderBody = useCallback(
        (newDocument) =>
            renderToString(
                <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                    <ViewerComponent document={newDocument} />
                </ComponentsProvider>,
            ),
        [],
    );
    const previousBody = useRef(null);
    const body = useMemo(() => renderBody(document), [renderBody, document]);

    useEffect(() => {
        const editor = nicheEditorRef.current;
        console.log('Body could change', body, previousBody.current);
        if (editor !== null && previousBody.current !== body) {
            previousBody.current = body;
            const { selection: currentSelection = null } = editor.editing.view.document || {};
            const range = currentSelection.getFirstRange();

            console.log('Body has changed yeesh');
            editor.setData(body);

            setTimeout(() => {
                editor.model.change((writer) => {
                    console.log('my range', range);
                    writer.setSelection(range);
                });
            }, 1000);
        }
    }, [body, onChange]);

    useEffect(() => {
        if (nicheEditorRef.current === null && editorRef.current !== null) {
            NicheEditor.create(editorRef.current)
                .then((editor) => {
                    // console.log('Editor was initialized', editor);
                    editor.setData(body);

                    const modelDocument = editor.model.document;
                    const viewDocument = editor.editing.view.document;

                    modelDocument.on('change:data', (event) => {
                        onEditorChange(event, editor);
                    });

                    viewDocument.on('focus', (event) => {
                        onEditorFocus(event, editor);
                    });

                    viewDocument.on('blur', (event) => {
                        onEditorBlur(event, editor);
                    });

                    CKEditorInspector.attach(editor);

                    nicheEditorRef.current = editor;
                })
                .catch((error) => {
                    console.error(error.stack);
                });
        }
    }, [body, onEditorChange, onEditorFocus, onEditorBlur]);

    // console.log('document', document);
    // console.log('body', body);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Editor
                left={<Outline components={components} onClick={scrollTo} />}
                right={
                    <div className={styles.right}>
                        {focusedBlock !== null && focusedBlock?.type ? (
                            <>
                                <p>{focusedBlock?.type}</p>
                                <Settings
                                    value={focusedBlock}
                                    fields={[
                                        {
                                            type: 'text',
                                            name: 'body',
                                            withoutFormGroup: true,
                                            placeholder: 'Body',
                                        },
                                        { type: 'toggle', name: 'test' },
                                    ]}
                                    onChange={onFieldChange}
                                />
                            </>
                        ) : null}
                    </div>
                }
            >
                <Preview>
                    <div ref={editorRef} />
                </Preview>
            </Editor>
        </div>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
