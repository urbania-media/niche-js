import { ComponentsProvider } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect, useRef } from 'react';

import { Editor } from '@niche-js/core/components';
import {
    useViewerComponent,
    useBlocksComponentsManager,
    BLOCKS_NAMESPACE,
    EditorProvider,
    HEADERS_NAMESPACE,
    useHeadersComponentsManager,
} from '@niche-js/core/contexts';
import { findParentBlock } from '@niche-js/core/utils';

import MainEditor from './Editor';
import Outline from './Outline';
import Settings from './Settings';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({
        components: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    viewer: PropTypes.string,
    destinations: PropTypes.arrayOf(PropTypes.shape({})),
    settings: PropTypes.arrayOf(PropTypes.shape({})), // fields
    className: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    document: null,
    viewer: null,
    destinations: null,
    settings: null,
    className: null,
    onChange: null,
};

function EditorArticle({ document, viewer, destinations, settings, className, onChange }) {
    const { type = 'article', components = [] } = document || {};
    const [focusedBlock, setFocusedBlock] = useState(null);

    const documentRef = useRef(document);
    useEffect(() => {
        documentRef.current = document;
    }, [document]);

    const ViewerComponent = useViewerComponent(viewer || type || 'article');

    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();

    const headersManager = useHeadersComponentsManager();
    const headers = headersManager.getComponents();

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
        [document, onChange, setFocusedBlock],
    );

    const onContentChange = useCallback((event, data) => {
        if (data && onChange !== null) {
            const { components: newBlocks = null } = data || {};
            const { components: documentComponents = [] } = documentRef.current || {};
            const otherComponents = (documentComponents || []).filter(
                ({ role = null }) => role !== 'block',
            );
            const nextValue = {
                ...documentRef.current,
                components: [...otherComponents, ...newBlocks],
            };
            // console.log('onContentChange', nextValue, otherComponents, newBlocks);
            onChange(nextValue);
        }
    }, []);

    const onHeaderChange = useCallback((event, data) => {
        if (onChange !== null) {
            const { components: newHeaders = null } = data || {};
            const { components: documentComponents = [] } = documentRef.current || {};
            const otherComponents = (documentComponents || []).filter(
                ({ role = null }) => role !== 'header',
            );
            const [firstHeader = null] = newHeaders || [];
            const nextValue = {
                ...documentRef.current,
                components: [firstHeader, ...otherComponents],
            };
            // console.log('onHeaderChange', nextValue);
            onChange(nextValue);
        }
    }, []);

    const onEditorClick = useCallback(
        (event, editor) => {
            const { selection: currentSelection = null } = editor.editing.model.document || {};
            const range = currentSelection.getFirstRange() || null;
            const target = range !== null ? range.getCommonAncestor() : null;
            if (target !== null) {
                const blockUUID = findParentBlock(target);
                if (blockUUID !== null) {
                    const { components: documentComponents = [] } = documentRef.current || {};
                    const focused =
                        (documentComponents || []).find(({ uuid = null }) => uuid === blockUUID) ||
                        null;
                    setFocusedBlock(focused);
                }
            }
        },
        [setFocusedBlock],
    );

    const onOutlineClick = useCallback(
        (block) => {
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
        },
        [components, setFocusedBlock],
    );

    const onOutlineClickRemove = useCallback(
        (block) => {
            const { uuid: blockUUID = null } = block || {};
            if (blockUUID !== null) {
                if (focusedBlock !== null && focusedBlock.uuid === blockUUID) {
                    setFocusedBlock(null);
                }
                const others =
                    (components || []).filter(({ uuid = null }) => uuid !== blockUUID) || null;
                onChange({ ...document, components: others });
            }
        },
        [document, components, focusedBlock, setFocusedBlock],
    );

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Editor
                destinations={destinations}
                left={
                    <Outline
                        components={components}
                        onClick={onOutlineClick}
                        onClickRemove={onOutlineClickRemove}
                    />
                }
                right={
                    focusedBlock !== null && focusedBlock?.type ? (
                        <Settings
                            value={focusedBlock}
                            onChange={onFieldChange}
                            fields={[
                                ...(focusedBlock.fields || []),
                                ...(settings || []),
                                {
                                    type: 'text',
                                    name: 'body',
                                    withoutFormGroup: true,
                                    placeholder: 'Body',
                                },
                            ]}
                        />
                    ) : null
                }
            >
                <EditorProvider>
                    <ComponentsProvider namespace={HEADERS_NAMESPACE} components={headers}>
                        <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                            <ViewerComponent
                                withoutContent
                                headerChildren={
                                    <MainEditor
                                        document={document}
                                        onEditorChange={onHeaderChange}
                                        onEditorClick={onEditorClick}
                                        viewerProps={{ withoutContent: true }}
                                        // config={{ toolbar: [] }}
                                        locked
                                        debug
                                    />
                                }
                            />
                            <ViewerComponent contentOnly>
                                <MainEditor
                                    document={document}
                                    onEditorChange={onContentChange}
                                    onEditorClick={onEditorClick}
                                    viewerProps={{ contentOnly: true }}
                                />
                            </ViewerComponent>
                        </ComponentsProvider>
                    </ComponentsProvider>
                </EditorProvider>
            </Editor>
        </div>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
