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
import { Editor } from '@niche-js/core/components';
import {
    useViewerComponent,
    useBlocksComponentsManager,
    BLOCKS_NAMESPACE,
    EditorProvider,
} from '@niche-js/core/contexts';

import Outline from './Outline';
// import Preview from './Preview';
import Settings from './Settings';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({}),
    viewer: PropTypes.string,
    destinations: PropTypes.arrayOf(PropTypes.shape({})),
    className: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    document: null,
    viewer: null,
    destinations: null,
    className: null,
    onChange: null,
};

function findParentBlock(block) {
    // Works for both kind of views
    const nicheId = block.getAttribute
        ? block.getAttribute('uuid') || block.getAttribute('data-niche-uuid')
        : null;
    if (nicheId !== null) {
        return nicheId;
    }
    if (block.parent) {
        return findParentBlock(block.parent);
    }
    return null;
}

function EditorArticle({ document, viewer, destinations, className, onChange }) {
    const { type = 'article', components = [] } = document || {};
    const [focusedBlock, setFocusedBlock] = useState(null);
    const editorRef = useRef(null);
    const nicheEditorRef = useRef(null);

    const ViewerComponent = useViewerComponent(viewer || type || 'article');
    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();

    const onEditorChange = useCallback(
        (event, editor) => {
            const data = editor.getData();
            if (data && onChange !== null) {
                const { components: newComponents = null } = data || {};
                const nextValue = { ...document, components: newComponents };
                // console.log('onChange', nextValue);
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

    const onEditorClick = useCallback(
        (event, editor) => {
            const { selection: currentSelection = null } = editor.editing.model.document || {};
            const range = currentSelection.getFirstRange() || null;
            const target = range !== null ? range.getCommonAncestor() : null;
            if (target !== null) {
                const blockUUID = findParentBlock(target);
                if (blockUUID !== null) {
                    const focused =
                        (components || []).find(({ uuid = null }) => uuid === blockUUID) || null;
                    setFocusedBlock(focused);
                }
            }
        },
        [components, setFocusedBlock],
    );

    const onOutlineClick = useCallback((block) => {
        const { uuid: blockUUID = null } = block || {};
        if (blockUUID !== null) {
            const element =
                window.document.querySelector(`[data-niche-uuid="${blockUUID}"]`) || null;
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

    const previousBody = useRef(null);
    const body = useMemo(
        () =>
            renderToString(
                <EditorProvider>
                    <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                        <ViewerComponent document={document} />
                    </ComponentsProvider>
                </EditorProvider>,
            ),
        [document],
    );

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
                    // console.log('failed to focus on range', e, range);
                }
            });
        }
    }, [body, onChange]);

    useEffect(() => {
        if (nicheEditorRef.current === null && editorRef.current !== null) {
            NicheEditor.create(editorRef.current)
                .then((editor) => {
                    console.log('Editor was initialized', editor);

                    editor.setData(body);

                    const modelDocument = editor.model.document;
                    modelDocument.on('change:data', (event) => {
                        onEditorChange(event, editor);
                    });

                    const viewDocument = editor.editing.view.document;
                    viewDocument.on('click', (event) => onEditorClick(event, editor));

                    CKEditorInspector.attach(editor);
                    nicheEditorRef.current = editor;
                })
                .catch((error) => {
                    console.error(error.stack);
                });
        }
    }, [body, onEditorChange, onEditorClick]);

    console.log('editor article body', body);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Editor
                destinations={destinations}
                left={<Outline components={components} onClick={onOutlineClick} />}
                right={
                    <div className={styles.right}>
                        {focusedBlock !== null && focusedBlock?.type ? (
                            <>
                                <p>{focusedBlock?.type}</p>
                                <Settings value={focusedBlock} onChange={onFieldChange} />
                            </>
                        ) : null}
                    </div>
                }
            >
                <div ref={editorRef} />
            </Editor>
        </div>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
