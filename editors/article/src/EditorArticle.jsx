/* eslint-disable react/jsx-props-no-spreading */
import { Modals } from '@panneau/element-modal';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { PropTypes as NichePropTypes } from '@niche-js/core';
import { EditorLayout } from '@niche-js/core/components';
import { EditorProvider } from '@niche-js/core/contexts';
import { DocumentEditor } from '@niche-js/editor-lexical';

import Outline from './Outline';
import Settings from './Settings';

import styles from './styles.module.css';

const propTypes = {
    document: NichePropTypes.document,
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
    platformId: initialPlatformId,
    platforms,
    components: componentDefinitions,
    componentsSettings,
    className,
    onChange,
    onPlatformChange,
}) {
    const { type: documentType = 'article', components = [] } = document || {};

    console.log('editor document', document);

    const documentRef = useRef(document);
    useEffect(() => {
        documentRef.current = document;
    }, [document]);

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

    return (
        <EditorProvider platform={platform}>
            <div className={classNames([styles.container, { [className]: className !== null }])}>
                <EditorLayout
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
                    <DocumentEditor value={document} />
                </EditorLayout>
            </div>
            <Modals />
        </EditorProvider>
    );
}

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
