// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ComponentsProvider } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
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
    className: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    document: null,
    className: null,
    onChange: null,
};

function EditorArticle({ document, className, onChange }) {
    // const blocksDefinitions = useBlocksDefinitions();
    const ArticleComponent = useViewerComponent('article');

    const blocksManager = useBlocksComponentsManager();

    const onEditorReady = useCallback((editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready!', editor);
    }, []);

    const onEditorChange = useCallback(
        (event, editor) => {
            const data = editor.getData();
            console.log('newdata', event, data);
            if (onChange !== null) {
                onChange(data);
            }
        },
        [onChange],
    );

    const onEditorFocus = useCallback((event, editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Focus', event, event.source, event.source.selection.getFirstPosition());
    }, []);

    const onEditorBlur = useCallback((event, editor) => {
        // You can store the "editor" and use when it is needed.
        // console.log('Blur', event);
    }, []);

    const body = useMemo(
        () =>
            renderToString(
                <ComponentsProvider
                    namespace={BLOCKS_NAMESPACE}
                    components={blocksManager.getComponents()}
                >
                    <ArticleComponent document={document} />
                </ComponentsProvider>,
            ),
        [document, blocksManager],
    );

    const [focusedBlock, setFocusedBlock] = useState(null);
    const { components = [] } = document || [];

    const scrollTo = useCallback((block) => {
        console.log('scrollTo', block);
    });

    // console.log('current body', body);
    console.log('current document', document);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Editor
                left={
                    <div>
                        <p>Outline</p>
                        {(components || []).map((it) => (
                            <button
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
                    <div>
                        <p>Fields</p>
                        {focusedBlock !== null ? <p>Show fields</p> : null}
                    </div>
                }
            >
                <CKEditor
                    editor={NicheEditor}
                    data={body}
                    config={{
                        niche: {
                            // blocksPlugins: blocksDefinitions.map({ plugin } => plugin),
                            blockRenderer: (type, data, domElement) => {
                                console.log('render data', type, data);
                                const root = createRoot(domElement);

                                // const BlockComponent = blocksManager.getComponent(type);
                                // const root = createRoot(domElement);
                                root.render(<div>BLOCK RENDERER</div>);
                            },
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
