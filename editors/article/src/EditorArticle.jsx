import { ComponentsProvider } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { renderToString } from 'react-dom/server';

import { useNicheEditor } from '@niche-js/ckeditor';
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

import Outline from './Outline';
import Settings from './Settings';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({
        components: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    viewer: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.shape({})),
    components: PropTypes.arrayOf(
        PropTypes.shape({
            role: PropTypes.string,
            type: PropTypes.string,
            label: PropTypes.string,
            fields: PropTypes.arrayOf(
                PropTypes.shape({
                    platform: PropTypes.string,
                }),
            ),
            platform: PropTypes.string,
        }),
    ),
    settings: PropTypes.arrayOf(PropTypes.shape({})), // fields
    className: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    document: null,
    viewer: null,
    platforms: null,
    components: null,
    settings: null,
    className: null,
    onChange: null,
};

function EditorArticle({
    document,
    viewer,
    platforms,
    components: platformComponents,
    settings,
    className,
    onChange,
}) {
    const { type = 'article', components = [] } = document || {};
    const [focusedBlock, setFocusedBlock] = useState(null);

    const documentRef = useRef(document);
    useEffect(() => {
        documentRef.current = document;
    }, [document]);

    const ViewerComponent = useViewerComponent(viewer || type || 'article');

    const headersManager = useHeadersComponentsManager();
    const headers = headersManager.getComponents();

    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();

    const renderHeader = useCallback(
        (doc) =>
            renderToString(
                <EditorProvider>
                    <ComponentsProvider namespace={HEADERS_NAMESPACE} components={headers}>
                        <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                            <ViewerComponent document={doc} sectionOnly="header" />
                        </ComponentsProvider>
                    </ComponentsProvider>
                </EditorProvider>,
            ),
        [],
    );

    const renderContent = useCallback(
        (doc) =>
            renderToString(
                <EditorProvider>
                    <ComponentsProvider namespace={HEADERS_NAMESPACE} components={headers}>
                        <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                            <ViewerComponent document={doc} sectionOnly="content" />
                        </ComponentsProvider>
                    </ComponentsProvider>
                </EditorProvider>,
            ),
        [],
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
        [document, onChange, setFocusedBlock],
    );

    const onHeaderChange = useCallback(
        (event, editor) => {
            const editorData = editor.getData();
            const data = editorData !== '' ? editorData : null;

            if (onChange !== null) {
                const { components: newHeaders = null } = data || {};
                const { components: documentComponents = [] } = documentRef.current || {};
                const otherComponents = (documentComponents || []).filter(
                    ({ role = null }) => role !== 'header',
                );
                const firstHeader =
                    (newHeaders || []).find(({ role = null }) => role === 'header') || null;
                const { extra = false } = firstHeader || {};

                const nextValue = {
                    ...documentRef.current,
                    components: [
                        {
                            role: 'header',
                            type: 'article',
                            title: null,
                            subtitle: null,
                            surtitle: null,
                            image: null,
                            ...firstHeader,
                        },
                        ...otherComponents,
                    ],
                };

                console.log('onHeaderChange', nextValue);

                onChange(nextValue);
                // Reset editor in case
                if (extra || (newHeaders !== null && newHeaders.length > 1)) {
                    console.log('force header format');
                    const body = renderHeader(nextValue);
                    editor.setData(body);
                }
            }
        },
        [onChange],
    );

    const onContentChange = useCallback(
        (event, editor) => {
            const editorData = editor.getData();
            const data = editorData !== '' ? editorData : null;

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

                console.log('onContentChange', nextValue);

                onChange(nextValue);
            }
        },
        [onChange],
    );

    const onEditorClick = useCallback(
        (event, editor) => {
            console.log('onEditorClick', event);
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

    const headerBody = useMemo(() => renderHeader(document), [document]);
    const { containerRef: headerRef } = useNicheEditor({
        body: headerBody,
        onChange: onHeaderChange,
        onClick: onEditorClick,
        // debug: true,
    });

    const contentBody = useMemo(() => renderContent(document), [document]);
    const { containerRef: contentRef } = useNicheEditor({
        body: contentBody,
        onChange: onContentChange,
        onClick: onEditorClick,
        debug: true,
    });

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Editor
                platforms={platforms}
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
                    <ViewerComponent sectionOnly="header" editorRef={headerRef} />
                    <ViewerComponent sectionOnly="content" editorRef={contentRef} />
                </EditorProvider>
            </Editor>
        </div>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
