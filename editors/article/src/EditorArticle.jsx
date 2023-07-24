// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ComponentsProvider, useFieldComponent } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useMemo } from 'react';
// import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import NicheEditor from '@niche-js/ckeditor/build';
import {
    useViewerComponent,
    useBlocksComponentsManager,
    BLOCKS_NAMESPACE,
} from '@niche-js/core/contexts';
import Editor from '@niche-js/editor-editor';

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
    const nicheId = block.getAttribute ? block.getAttribute('data-niche-block-id') || null : null;
    if (nicheId !== null) {
        // console.log('target', block);
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
    // const [ckEditor, setCkEditor] = useState();
    const [focusedBlock, setFocusedBlock] = useState(null);

    // const blocksDefinitions = useBlocksDefinitions();
    const ViewerComponent = useViewerComponent(viewer || type || 'article');

    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();
    const Fields = useFieldComponent('fields');

    console.log('The Document', document);

    const onEditorReady = useCallback((editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready!', editor);
        // CKEditorInspector.attach(editor);
        // setCkEditor(editor);

        // editor.ui.focusTracker.on('change:focusedElement', (evt, data, isFocused) => {
        //     console.log(`The editor is focused noww: ${data} ${isFocused}.`);
        // });
    }, []);

    const onEditorChange = useCallback(
        (event, editor) => {
            const data = editor.getData();
            console.log('editor get data event', event.source);
            if (data && onChange !== null) {
                const { components: newComponents = null } = data || {};
                const nextValue = { ...document, components: newComponents };
                console.log('editor onchange', nextValue);
                onChange(nextValue);
            }
        },
        [document, onChange],
    );

    const onFieldChange = useCallback(
        (newValue) => {
            console.log('field change', newValue);
            const { id: blockId = null } = newValue || {};
            // const { components: newComponents = null } = document || {};
            const newComponents = components.reduce((acc, comp) => {
                const { id = null } = comp || {};
                if (blockId !== null && id === blockId) {
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
            const target = event.source.selection.getFirstPosition();
            // const target =
            //     first !== null && first.parent
            //         ? first.parent.document.selection.getFirstPosition()
            // : null;
            if (target !== null) {
                const blockId = findParentBlock(target.parent);
                if (blockId !== null) {
                    const focused =
                        (components || []).find(({ id = null }) => id === blockId) || null;
                    setFocusedBlock(focused);
                }
            }
        },
        [components, setFocusedBlock],
    );

    const onEditorBlur = useCallback(
        (event, editor) => {
            // You can store the "editor" and use when it is needed.
            // console.log('Blur', event);
            // setFocusedBlock(null);
        },
        [setFocusedBlock],
    );

    const scrollTo = useCallback((block) => {
        const { id = null } = block || {};
        if (id !== null) {
            const element = window.document.getElementById(id) || null;
            console.log('scrollTo', id, element);
            if (element !== null) {
                element.scrollIntoView();
            }
        }
    });

    const dataToView = useCallback(
        () =>
            renderToString(
                <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                    <ViewerComponent document={document} />
                </ComponentsProvider>,
            ),
        [document, blocks],
    );
    // const body = useMemo(() => dataToView(), [dataToView]);

    // console.log('current document', document);
    // console.log('my body', body, document);
    // console.log('components', components);
    // console.log('focusedBlock', focusedBlock);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Editor
                left={
                    <div>
                        <p>Outline</p>
                        {(components || []).map((it, i) => (
                            <button
                                key={`outline-${i + 1}-${it.type}`}
                                type="button"
                                className={styles.button}
                                onClick={() => scrollTo(it)}
                            >
                                {it.type}
                            </button>
                        ))}
                    </div>
                }
                right={
                    <div className={styles.fields}>
                        <p>Fields</p>
                        {focusedBlock !== null && focusedBlock?.type ? (
                            <>
                                <p>{focusedBlock?.type}</p>
                                <Fields
                                    className={styles.field}
                                    value={focusedBlock}
                                    fields={[
                                        {
                                            type: 'text',
                                            name: 'id',
                                            withoutFormGroup: true,
                                            placeholder: 'Place',
                                        },
                                        { type: 'toggle', name: 'truefalse' },
                                    ]}
                                    onChange={onFieldChange}
                                />
                            </>
                        ) : null}
                    </div>
                }
            >
                <CKEditor
                    editor={NicheEditor}
                    // data={body}
                    config={{
                        niche: {
                            dataToView,
                            // blocksPlugins: blocksDefinitions.map({ plugin } => plugin),
                            // blockRenderer: (type, data, domElement) => {
                            //     console.log('render data', type, data);
                            //     const root = createRoot(domElement);
                            //     // const BlockComponent = blocksManager.getComponent(type);
                            //     // const root = createRoot(domElement);
                            //     root.render(<div>BLOCK RENDERER</div>);
                            // },
                        },
                    }}
                    onReady={onEditorReady}
                    onChange={onEditorChange}
                    onFocus={onEditorFocus}
                    onBlur={onEditorBlur}
                />
            </Editor>
        </div>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
