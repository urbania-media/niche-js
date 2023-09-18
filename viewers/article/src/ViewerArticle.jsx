/* eslint-disable react/forbid-prop-types, no-nested-ternary, react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { PropTypes as NichePropTypes } from '@niche-js/core';
import { Component } from '@niche-js/core/components';
import { useHeadersComponentsManager, useBlocksComponentsManager } from '@niche-js/core/contexts';

import styles from './styles.module.css';

const propTypes = {
    components: NichePropTypes.components,
    metadata: NichePropTypes.metadata,
    sectionOnly: PropTypes.oneOf([null, 'header', 'content']),
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    editorRef: PropTypes.oneOfType([PropTypes.shape({ current: PropTypes.any }), PropTypes.func]),
};

const defaultProps = {
    components: null,
    metadata: null,
    sectionOnly: null,
    className: null,
    headerClassName: null,
    contentClassName: null,
    editorRef: null,
};

function ViewerArticle({
    components,
    metadata,
    sectionOnly,
    className,
    headerClassName,
    contentClassName,
    editorRef,
}) {
    const { brand = null } = metadata || {};

    const blocksManager = useBlocksComponentsManager();
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    const headersManager = useHeadersComponentsManager();
    const header = (components || []).find(({ role = null }) => role === 'header');
    const { type: headerType = null } = header || {};
    const HeaderComponent = headersManager.getComponent(headerType);

    console.log(
        'niche-js viewer document components',
        components,
        'niche-js viewer managers',
        blocksManager,
        headersManager,
    );

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {sectionOnly === null || sectionOnly === 'header' ? (
                <div
                    className={classNames([
                        styles.header,
                        { [headerClassName]: headerClassName !== null },
                    ])}
                >
                    {editorRef === null ? (
                        HeaderComponent !== null && header !== null ? (
                            <Component component={header}>
                                <HeaderComponent {...header} brand={brand} />
                            </Component>
                        ) : null
                    ) : (
                        <div ref={editorRef} />
                    )}
                </div>
            ) : null}
            {sectionOnly === null || sectionOnly === 'content' ? (
                <div
                    className={classNames([
                        styles.content,
                        { [contentClassName]: contentClassName !== null },
                    ])}
                >
                    {editorRef === null ? (
                        (blocks || []).map((block) => {
                            const { id = null, uuid = null, type = null } = block || {};
                            const BlockComponent = blocksManager.getComponent(type);
                            return BlockComponent !== null ? (
                                <Component
                                    component={block}
                                    key={`block-${id}-${type}-${uuid}`}
                                    inline={type === 'text' || type === 'heading'}
                                >
                                    <BlockComponent {...block} />
                                </Component>
                            ) : null;
                        })
                    ) : (
                        <div ref={editorRef} />
                    )}
                </div>
            ) : null}
        </div>
    );
}

ViewerArticle.propTypes = propTypes;
ViewerArticle.defaultProps = defaultProps;

export default ViewerArticle;
