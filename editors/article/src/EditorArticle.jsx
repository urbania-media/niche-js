import { ComponentsProvider } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { v4 as uuidV4 } from 'uuid';

import { useNicheEditor } from '@niche-js/ckeditor';
import { Editor } from '@niche-js/core/components';
import {
    useViewerComponent,
    useBlocksComponentsManager,
    BLOCKS_NAMESPACE,
    EditorProvider,
    HEADERS_NAMESPACE,
    useHeadersComponentsManager,
    PlatformProvider,
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
    platformId: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.shape({})),
    components: PropTypes.arrayOf(
        PropTypes.shape({
            role: PropTypes.string,
            type: PropTypes.string,
            label: PropTypes.string,
            fields: PropTypes.arrayOf(PropTypes.shape({})),
            platform: PropTypes.string,
        }),
    ),
    componentsSettings: PropTypes.arrayOf(PropTypes.shape({})),
    settings: PropTypes.arrayOf(PropTypes.shape({})), // global editor settings
    className: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    document: null,
    viewer: null,
    platformId: null,
    platforms: null,
    components: null,
    componentsSettings: null,
    settings: null,
    className: null,
    onChange: null,
};

function EditorArticle({
    document,
    viewer,
    platformId: initialPlatformId,
    platforms,
    components: componentDefinitions,
    componentsSettings,
    settings,
    className,
    onChange,
}) {
    const { type: documentType = 'article', components = [] } = document || {};

    const documentRef = useRef(document);
    useEffect(() => {
        documentRef.current = document;
    }, [document]);

    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedHeaderComponent, setSelectedHeaderComponent] = useState(null);

    const [platformId, setPlatformId] = useState(initialPlatformId);
    const platform = (platforms || []).find(({ id = null }) => id === platformId) || null;
    const onPlatformChange = useCallback(
        (newPlatform) => {
            const { id = null } = newPlatform || {};
            setPlatformId(id);
        },
        [setPlatformId],
    );

    const headerDefinitions = useMemo(
        () =>
            (componentDefinitions || []).filter(
                ({ role: componentRole = null, platform: componentPlatform = null }) =>
                    componentRole === 'header' &&
                    (componentPlatform === null ||
                        platform === null ||
                        platform.id === componentPlatform),
            ) || null,
        [componentDefinitions, platform],
    );

    const headerSettings = useMemo(
        () =>
            selectedHeaderComponent !== null
                ? [
                      {
                          type: 'select',
                          name: 'type',
                          options: (headerDefinitions || []).map(
                              ({ type = null, name = null }) => ({
                                  value: type,
                                  label: name,
                              }),
                          ),
                      },
                  ]
                : null,
        [selectedHeaderComponent, headerDefinitions],
    );

    const onHeaderSettingsChange = useCallback(
        (newValue) => {
            const {
                type: headerType = null,
                platform: headerPlatform = null,
                uuid: headerUUID = null,
            } = newValue || {};

            const { components: currentComponents = [] } = documentRef.current || {};
            const currentHeader = (currentComponents || []).find(
                ({ uuid = null }) => uuid === headerUUID,
            );
            const { type: currentHeaderType = null } = currentHeader || {};

            let newComponents = currentComponents || [];
            const typeChanged = currentHeaderType !== headerType;

            const newHeaderDefinition = (headerDefinitions || []).find(
                ({ type = null }) => type === headerType,
            );

            const { platform: newPlatform = null } = newHeaderDefinition || {};

            // console.log('typeChanged', typeChanged, headerPlatform, newPlatform);

            let finalNewValue = newValue;
            if (typeChanged && headerPlatform === null && newPlatform !== null) {
                finalNewValue = { ...newValue, id: null, platform: newPlatform, uuid: uuidV4() };
                newComponents = [finalNewValue, ...currentComponents];
            } else if (typeChanged && headerPlatform !== null && newPlatform === null) {
                finalNewValue = currentComponents.find(
                    ({ role = null, platform: componentPlatform = null }) =>
                        role === 'header' && componentPlatform == null,
                );
                newComponents = [
                    ...currentComponents.filter(({ uuid = null }) => uuid !== headerUUID),
                ];
            } else {
                newComponents = currentComponents.reduce((acc, comp) => {
                    const { uuid = null } = comp || {};
                    if (headerUUID !== null && uuid === headerUUID) {
                        return [...acc, newValue];
                    }
                    return [...acc, comp];
                }, []);
            }

            const nextValue = { ...documentRef.current, components: newComponents };
            onChange(nextValue);
            documentRef.current = nextValue;

            setSelectedHeaderComponent(finalNewValue);
        },
        [onChange, headerDefinitions, setSelectedHeaderComponent],
    );

    const ViewerComponent = useViewerComponent(viewer || documentType || 'article');

    const headersManager = useHeadersComponentsManager();
    const headers = headersManager.getComponents();

    const blocksManager = useBlocksComponentsManager();
    const blocks = blocksManager.getComponents();

    const headerDocument = useMemo(() => {
        const { components: documentComponents = [] } = document || {};
        const platformComponent =
            platform !== null
                ? (documentComponents || []).find(
                      ({ role = null, platform: componentPlatform = null }) =>
                          role === 'header' && componentPlatform === platform.id,
                  )
                : null;
        const defaultComponent = (documentComponents || []).find(
            ({ role = null, platform: componentPlatform = null }) =>
                role === 'header' && componentPlatform === null,
        );
        const finalComponent = platformComponent || defaultComponent || null;

        return {
            ...document,
            components: finalComponent !== null ? [finalComponent] : [],
        };
    }, [document, platform]);

    const renderDocument = useCallback(
        (doc, section = null) =>
            renderToString(
                <EditorProvider>
                    <ComponentsProvider namespace={HEADERS_NAMESPACE} components={headers}>
                        <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                            <ViewerComponent document={doc} sectionOnly={section} />
                        </ComponentsProvider>
                    </ComponentsProvider>
                </EditorProvider>,
            ),
        [],
    );

    const onSettingsChange = useCallback(
        (newValue) => {
            const { uuid: componentUUID = null } = newValue || {};
            const newComponents = components.reduce((acc, comp) => {
                const { uuid = null } = comp || {};
                if (componentUUID !== null && uuid === componentUUID) {
                    return [...acc, newValue];
                }
                return [...acc, comp];
            }, []);
            onChange({ ...document, components: newComponents });
            setSelectedComponent(newValue);
        },
        [document, onChange, setSelectedComponent],
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
                const platformHeader =
                    platform !== null
                        ? (newHeaders || []).find(
                              ({ role = null, platform: componentPlatform = null }) =>
                                  role === 'header' && componentPlatform === platform.id,
                          )
                        : null;
                const defaultHeader = (newHeaders || []).find(
                    ({ role = null, platform: componentPlatform = null }) =>
                        role === 'header' && componentPlatform === null,
                );
                const firstHeader = platformHeader || defaultHeader || null;

                console.log('fh', newHeaders, firstHeader, platformHeader, defaultHeader);

                const otherHeaders = documentComponents.filter(
                    ({ role = null, id = null }) =>
                        role === 'header' && (firstHeader === null || id !== firstHeader.id),
                );

                const { extra = false } = firstHeader || {};
                const newHeader = {
                    role: 'header',
                    type: 'article',
                    title: null,
                    subtitle: null,
                    surtitle: null,
                    image: null,
                    uuid: uuidV4(),
                    ...firstHeader,
                };

                const nextValue = {
                    ...documentRef.current,
                    components: [newHeader, ...otherHeaders, ...otherComponents],
                };

                onChange(nextValue);
                documentRef.current = nextValue;

                // Reset editor in case
                if (extra || (newHeaders !== null && newHeaders.length > 1)) {
                    // console.log('force header format');
                    const body = renderDocument(
                        {
                            ...documentRef.current,
                            components: [newHeader],
                        },
                        'header',
                    );
                    editor.setData(body);
                }
            }
        },
        [platform, onChange],
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
                onChange(nextValue);
                documentRef.current = nextValue;
            }
        },
        [onChange],
    );

    const onContentClick = useCallback(
        (event, editor) => {
            const { selection: currentSelection = null } = editor.editing.model.document || {};
            const range = currentSelection.getFirstRange() || null;
            const target = range !== null ? range.getCommonAncestor() : null;
            if (target !== null) {
                const blockUUID = findParentBlock(target);
                if (blockUUID !== null) {
                    const { components: documentComponents = [] } = documentRef.current || {};
                    const selected =
                        (documentComponents || []).find(({ uuid = null }) => uuid === blockUUID) ||
                        null;
                    setSelectedComponent(selected);
                    setSelectedHeaderComponent(null);
                }
            }
        },
        [setSelectedComponent],
    );

    const onHeaderClick = useCallback(
        (event, editor) => {
            const { selection: currentSelection = null } = editor.editing.model.document || {};
            const range = currentSelection.getFirstRange() || null;
            const target = range !== null ? range.getCommonAncestor() : null;
            if (target !== null) {
                const blockUUID = findParentBlock(target);
                if (blockUUID !== null) {
                    const { components: documentComponents = [] } = documentRef.current || {};
                    const selected =
                        (documentComponents || []).find(({ uuid = null }) => uuid === blockUUID) ||
                        null;
                    setSelectedHeaderComponent(selected);
                    setSelectedComponent(null);
                }
            }
        },
        [setSelectedComponent],
    );

    const onOutlineClick = useCallback(
        (component) => {
            const { uuid: componentUUID = null } = component || {};
            if (componentUUID !== null) {
                const element =
                    window.document.querySelector(`[data-niche-uuid="${componentUUID}"]`) || null;
                if (element !== null) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            if (componentUUID !== null) {
                const selected =
                    (components || []).find(({ uuid = null }) => uuid === componentUUID) || null;
                const { role: selectedRole = null } = component || {};
                if (selectedRole === 'header') {
                    setSelectedHeaderComponent(selected);
                } else {
                    setSelectedComponent(selected);
                }
            }
        },
        [components, setSelectedComponent, setSelectedHeaderComponent],
    );

    const onOutlineClickRemove = useCallback(
        (block) => {
            const { uuid: blockUUID = null } = block || {};
            if (blockUUID !== null) {
                if (selectedComponent !== null && selectedComponent.uuid === blockUUID) {
                    setSelectedComponent(null);
                }
                const others =
                    (components || []).filter(({ uuid = null }) => uuid !== blockUUID) || null;
                const nextValue = { ...document, components: others };
                onChange(nextValue);
                documentRef.current = nextValue;
            }
        },
        [document, components, selectedComponent, setSelectedComponent],
    );

    const headerBody = useMemo(
        () => renderDocument(headerDocument, 'header'),
        [headerDocument, renderDocument],
    );
    const { containerRef: headerRef } = useNicheEditor({
        body: headerBody,
        onChange: onHeaderChange,
        onClick: onHeaderClick,
        debug: true,
    });

    const contentBody = useMemo(
        () => renderDocument(document, 'content'),
        [document, renderDocument],
    );

    const { containerRef: contentRef } = useNicheEditor({
        body: contentBody,
        onChange: onContentChange,
        onClick: onContentClick,
        // debug: true,
    });

    const hasSettings = selectedComponent !== null && selectedComponent?.type;
    const settingsDefinition = hasSettings
        ? (componentDefinitions || []).find(
              ({
                  type: componentType = null,
                  role: componentRole = null,
                  platform: componentPlatform = null,
              }) =>
                  selectedComponent?.role === componentRole &&
                  selectedComponent?.type === componentType &&
                  (platform === null || platform.id === componentPlatform),
          ) || null
        : null;

    // const outlineComponents = components.filter(
    //     ({ role = null, type = null }) => role !== 'header',
    // );

    console.log('selectedHeaderComponent', selectedHeaderComponent);

    return (
        <PlatformProvider platform={platform}>
            <div className={classNames([styles.container, { [className]: className !== null }])}>
                <Editor
                    platformId={platformId}
                    platforms={platforms}
                    onPlatformChange={onPlatformChange}
                    outline={
                        <div className={styles.outline}>
                            <Outline
                                components={components}
                                onClick={onOutlineClick}
                                onClickRemove={onOutlineClickRemove}
                            />
                        </div>
                    }
                    settings={
                        <div className={styles.settings}>
                            {selectedHeaderComponent !== null ? (
                                <Settings
                                    value={selectedHeaderComponent}
                                    onChange={onHeaderSettingsChange}
                                    fields={[...(headerSettings || [])]}
                                />
                            ) : null}
                            {hasSettings ? (
                                <Settings
                                    value={selectedComponent}
                                    onChange={onSettingsChange}
                                    fields={[
                                        ...(settingsDefinition !== null
                                            ? settingsDefinition?.fields || []
                                            : []),
                                        ...(componentsSettings || []),
                                    ]}
                                />
                            ) : null}
                        </div>
                    }
                >
                    <EditorProvider>
                        <ViewerComponent sectionOnly="header" editorRef={headerRef} />
                        <ViewerComponent sectionOnly="content" editorRef={contentRef} />
                    </EditorProvider>
                </Editor>
            </div>
        </PlatformProvider>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
