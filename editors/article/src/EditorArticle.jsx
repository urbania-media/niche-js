/* eslint-disable react/jsx-props-no-spreading */
import { Modals } from '@panneau/element-modal';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { v4 as uuidV4 } from 'uuid';

import { useNicheEditor } from '@niche-js/ckeditor';
import { Editor } from '@niche-js/core/components';
import {
    BLOCKS_NAMESPACE,
    ComponentsProvider,
    EditorProvider,
    HEADERS_NAMESPACE,
    useBlocksComponentsManager,
    useHeadersComponentsManager,
    useModalComponent,
    useViewerComponent,
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
    // settings: PropTypes.arrayOf(PropTypes.shape({})), // global editor settings
    debug: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onPlatformChange: PropTypes.func,
    onRequestImageChange: PropTypes.func,
    RenderContainer: PropTypes.node,
    RenderContainerProps: PropTypes.shape({}),
};

const defaultProps = {
    document: null,
    viewer: null,
    platformId: null,
    platforms: null,
    components: null,
    componentsSettings: null,
    // settings: null,
    debug: 'header',
    className: null,
    onChange: null,
    onPlatformChange: null,
    onRequestImageChange: null,
    RenderContainer: null,
    RenderContainerProps: null,
};

function EditorArticle({
    document,
    viewer,
    platformId: initialPlatformId,
    platforms,
    components: componentDefinitions,
    componentsSettings,
    // settings,
    debug,
    className,
    onChange,
    onPlatformChange,
    onRequestImageChange,
    RenderContainer,
    RenderContainerProps,
}) {
    const { type: documentType = 'article', components = [] } = document || {};

    console.log('editor document', document);

    const documentRef = useRef(document);
    useEffect(() => {
        documentRef.current = document;
    }, [document]);

    const [modal, setModal] = useState(null);

    const onDismissPicker = useCallback(() => {
        setModal(null);
    }, [setModal]);

    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedHeaderComponent, setSelectedHeaderComponent] = useState(null);

    const selectComponent = useCallback(
        (type = null, component = null) => {
            if (type === 'header') {
                setSelectedComponent(null);
                setSelectedHeaderComponent(component);
            } else if (type === 'content') {
                setSelectedComponent(component);
                setSelectedHeaderComponent(null);
            } else {
                setSelectedComponent(null);
                setSelectedHeaderComponent(null);
            }
        },
        [setSelectedComponent, setSelectedHeaderComponent],
    );

    const [platformId, setPlatformId] = useState(initialPlatformId);
    const platform =
        platformId !== null
            ? (platforms || []).find(({ id = null }) => id === platformId) || null
            : null;
    const onFinalPlatformChange = useCallback(
        (newPlatform) => {
            const { id = null } = newPlatform || {};
            setPlatformId(id);
            if (onPlatformChange !== null) {
                onPlatformChange(id);
            }
        },
        [setPlatformId, onPlatformChange],
    );

    const headerDefinitions = useMemo(
        () =>
            (componentDefinitions || []).filter(
                ({ role: componentRole = null, platformId: componentPlatform = null }) =>
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
                          clearable: false,
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

            console.log('onHeaderSettingsChange', typeChanged, headerPlatform, newPlatform);

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
            selectComponent('header', finalNewValue);
        },
        [onChange, headerDefinitions, selectComponent],
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
                RenderContainer !== null ? (
                    <EditorProvider platform={platform}>
                        <ComponentsProvider namespace={HEADERS_NAMESPACE} components={headers}>
                            <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                                <RenderContainer {...RenderContainerProps}>
                                    <ViewerComponent document={doc} sectionOnly={section} />
                                </RenderContainer>
                            </ComponentsProvider>
                        </ComponentsProvider>
                    </EditorProvider>
                ) : (
                    <EditorProvider platform={platform}>
                        <ComponentsProvider namespace={HEADERS_NAMESPACE} components={headers}>
                            <ComponentsProvider namespace={BLOCKS_NAMESPACE} components={blocks}>
                                <ViewerComponent document={doc} sectionOnly={section} />
                            </ComponentsProvider>
                        </ComponentsProvider>
                    </EditorProvider>
                ),
            ),
        [RenderContainer, RenderContainerProps, ViewerComponent, headers, blocks, platform],
    );

    // console.log('headers', headers);

    const onSettingsChange = useCallback(
        (newValue) => {
            const { role = null, uuid: componentUUID = null } = newValue || {};
            const newComponents = (components || []).reduce((acc, comp) => {
                const { uuid = null } = comp || {};
                if (componentUUID !== null && uuid === componentUUID) {
                    return [...acc, newValue];
                }
                return [...acc, comp];
            }, []);
            onChange({ ...document, components: newComponents });
            if (componentUUID !== null) {
                selectComponent(role === 'header' ? 'header' : 'content', newValue);
            }
        },
        [document, onChange, selectComponent],
    );

    const onHeaderChange = useCallback(
        (event, editor) => {
            const editorData = editor.getData();
            const data = editorData !== '' ? editorData : null;

            if (onChange !== null) {
                console.log('header change', data);
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

                const otherHeaders = documentComponents.filter(
                    ({ role = null, uuid = null }) =>
                        role === 'header' && (firstHeader === null || uuid !== firstHeader.uuid),
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

                // console.log('onHeaderChange newHeaders', newHeaders);
                // console.log('onHeaderChange match', platformHeader, defaultHeader);
                // console.log('onHeaderChange components', newHeader, otherHeaders, otherComponents);
                // console.log('onHeaderChange nextValue', nextValue);

                onChange(nextValue);
                documentRef.current = nextValue;

                // TODO: Reset editor in case of ??? this might not be needed anymore
                if (extra || (newHeaders !== null && newHeaders.length > 1)) {
                    // console.log('force header format');
                    // const body = renderDocument(
                    //     {
                    //         ...documentRef.current,
                    //         components: [newHeader],
                    //     },
                    //     'header',
                    // );
                    // editor.setData(body);
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
                console.log('content', data);
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
            console.log('click content');
            if (target !== null) {
                const blockUUID = findParentBlock(target);
                if (blockUUID !== null) {
                    const { components: documentComponents = [] } = documentRef.current || {};
                    const selected =
                        (documentComponents || []).find(({ uuid = null }) => uuid === blockUUID) ||
                        null;
                    selectComponent('content', selected);
                }
            }
        },
        [selectComponent],
    );

    const onHeaderClick = useCallback(
        (event, editor) => {
            const { selection: currentSelection = null } = editor.editing.model.document || {};
            const range = currentSelection.getFirstRange() || null;
            const target = range !== null ? range.getCommonAncestor() : null;
            console.log('click header');
            if (target !== null) {
                const blockUUID = findParentBlock(target);
                if (blockUUID !== null) {
                    const { components: documentComponents = [] } = documentRef.current || {};
                    const selected =
                        (documentComponents || []).find(({ uuid = null }) => uuid === blockUUID) ||
                        null;
                    selectComponent('header', selected);
                }
            }
        },
        [selectComponent],
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
                selectComponent(selectedRole === 'header' ? 'header' : 'content', selected);
            }
        },
        [components, selectComponent],
    );

    const onOutlineClickRemove = useCallback(
        (block) => {
            const { uuid: blockUUID = null } = block || {};
            if (blockUUID !== null) {
                if (selectedComponent !== null && selectedComponent.uuid === blockUUID) {
                    selectComponent(null);
                }
                const others =
                    (components || []).filter(({ uuid = null }) => uuid !== blockUUID) || null;
                const nextValue = { ...document, components: others };
                onChange(nextValue);
                documentRef.current = nextValue;
            }
        },
        [document, components, selectedComponent, selectComponent],
    );

    const onRequestPicker = useCallback(
        (picker, key, uuid) => {
            setModal({
                type: 'picker',
                component: picker,
                onChange: (newValue) => {
                    const data = document || null;
                    if (key !== null && uuid !== null && onChange !== null) {
                        const { components: documentComponents = null } = data || {};
                        onChange({
                            ...document,
                            components: documentComponents.reduce((acc, component) => {
                                const { uuid: componentUUID = null } = component || {};
                                if (uuid !== null && componentUUID === uuid) {
                                    acc.push({ ...component, [key]: newValue });
                                    return acc;
                                }
                                acc.push(component);
                                return acc;
                            }, []),
                        });
                    }
                    onDismissPicker();
                },
                onClose: onDismissPicker,
            });
        },
        [document, setModal, onDismissPicker, onChange],
    );

    const onRequestRemove = useCallback(
        (key, uuid) => {
            const data = document || null;
            if (key !== null && uuid !== null && onChange !== null) {
                const { components: documentComponents = null } = data || {};
                onChange({
                    ...document,
                    components: documentComponents.reduce((acc, component) => {
                        const { uuid: componentUUID = null } = component || {};
                        if (uuid !== null && componentUUID === uuid) {
                            acc.push({ ...component, [key]: null });
                            return acc;
                        }
                        acc.push(component);
                        return acc;
                    }, []),
                });
            }
        },
        [document, onChange],
    );

    const headerBody = useMemo(
        () => renderDocument(headerDocument, 'header'),
        [headerDocument, renderDocument],
    );

    const { containerRef: headerRef } = useNicheEditor({
        body: headerBody,
        onChange: onHeaderChange,
        onRequestPicker,
        onRequestRemove,
        onRequestImageChange,
        onClick: onHeaderClick,
        onFocus: () => {
            console.log('hello focus header');
        },
        debug: debug === 'header',
        config: {
            blockToolbar: null,
        },
    });

    const contentBody = useMemo(
        () => renderDocument(document, 'content'),
        [document, renderDocument],
    );

    const { containerRef: contentRef } = useNicheEditor({
        body: contentBody,
        onChange: onContentChange,
        // onRequestPicker,
        // onRequestRemove,
        onRequestImageChange,
        onClick: onContentClick,
        onFocus: () => {
            console.log('hello focus body');
        },
        debug: debug === 'content',
    });

    const hasSettings = selectedComponent !== null && typeof selectedComponent.type !== 'undefined';
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

    const { fields: settingsFields = null } = settingsDefinition || {};

    // if (settingsFields !== null) {
    //     console.log('settingsFields', settingsFields);
    // }

    // TODO: see how to handle headers? Maybe only show first?
    const outlineComponents = useMemo(
        () =>
            components.filter(
                ({ platform: componentPlatform = null }) =>
                    platformId === null ||
                    componentPlatform == null ||
                    componentPlatform === platformId,
            ),
        [components, platformId],
    );

    // console.log('selectedHeaderComponent', selectedHeaderComponent);
    // console.log('vc', ViewerComponent);
    // const documentHeader = (components || []).find(({ type = null }) => type === 'header');

    const { type: modalType = null, ...modalProps } = modal || {};
    const ModalComponent = useModalComponent(modalType);

    return (
        <EditorProvider platform={platform}>
            <div className={classNames([styles.container, { [className]: className !== null }])}>
                <Editor
                    platformId={platformId}
                    platforms={platforms}
                    onPlatformChange={onFinalPlatformChange}
                    outline={
                        <div className={styles.outline}>
                            <Outline
                                components={outlineComponents}
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
                                        ...(settingsFields || []),
                                        ...(componentsSettings || []),
                                    ]}
                                />
                            ) : null}
                        </div>
                    }
                >
                    <ViewerComponent
                        document={document}
                        // header={documentHeader}
                        sectionOnly="header"
                        editorRef={headerRef}
                    />
                    <ViewerComponent
                        document={document}
                        sectionOnly="content"
                        editorRef={contentRef}
                    />
                    {ModalComponent !== null ? <ModalComponent {...modalProps} /> : null}
                </Editor>
            </div>
            <Modals />
        </EditorProvider>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
