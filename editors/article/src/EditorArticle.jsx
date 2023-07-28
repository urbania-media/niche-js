// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ComponentsProvider } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
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
        console.log('target', nicheId);
        return nicheId;
    }
    if (block.parent) {
        console.log('parent', block.parent);
        return findParentBlock(block.parent);
    }
    return null;
}

function EditorArticle({ document, viewer, className, onChange }) {
    const { type = 'article', components = [] } = document || {};
    const [focusedBlock, setFocusedBlock] = useState(null);

    const ViewerComponent = useViewerComponent(viewer || type || 'article');
    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();
    // const blocksDefinitions = useBlocksDefinitions();

    console.log('The Document Value', document);

    const onEditorReady = useCallback((editor) => {
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
            const { uuid: blockUUID = null } = newValue || {};
            // const { components: newComponents = null } = document || {};
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
            const target = event.source.selection.getFirstPosition();
            // console.log(target);
            // const target =
            //     first !== null && first.parent
            //         ? first.parent.document.selection.getFirstPosition()
            // : null;
            if (target !== null) {
                const blockUUID = findParentBlock(target);
                console.log('blockUUID', blockUUID, components);
                if (blockUUID !== null) {
                    const focused =
                        (components || []).find(({ uuid = null }) => uuid === blockUUID) || null;
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
        const { uuid = null } = block || {};
        // console.log('scrollTo', uuid);
        if (uuid !== null) {
            const element = window.document.getElementById(uuid) || null;
            // console.log('scrollTo element', element);
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
                                            name: 'uuid',
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
                <Preview>
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
                </Preview>
            </Editor>
        </div>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
