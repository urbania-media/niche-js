/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { PropTypes as NichePropTypes } from '@niche-js/core';
import { Component } from '@niche-js/core/components';
import { useHeadersComponentsManager, useBlocksComponentsManager } from '@niche-js/core/contexts';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({
        components: NichePropTypes.components,
    }),
    headerOnly: PropTypes.bool,
    contentOnly: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    document: null,
    headerOnly: false,
    contentOnly: false,
    className: null,
    children: null,
};

function ViewerArticle({ document, headerOnly, contentOnly, className, children }) {
    const { components = null, metadata = null } = document || {};
    const { brand = null } = metadata || {};

    const blocksManager = useBlocksComponentsManager();
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    const headersManager = useHeadersComponentsManager();
    const header = (components || [])
        .filter(({ role = null }) => role === 'header')
        .reduce((acc, head) => {
            // TODO: make this better
            const {
                id = null,
                uuid = null,
                body = null,
                media = null,
                role = null,
                type = null,
            } = head || {};
            return type !== null
                ? {
                      id,
                      uuid,
                      role,
                      ...acc,
                      [type]: body !== null ? body : media,
                  }
                : acc;
        }, null);
    const HeaderComponent = headersManager.getComponent('article');

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {!contentOnly || headerOnly ? (
                <div className={styles.header}>
                    {header !== null ? (
                        <Component component={header}>
                            <HeaderComponent {...header} brand={brand} />
                        </Component>
                    ) : null}
                </div>
            ) : null}
            {!headerOnly || contentOnly ? (
                <div className={styles.content}>
                    {(blocks || []).map((block) => {
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
                    })}
                </div>
            ) : null}
            {children}
        </div>
    );
}

ViewerArticle.propTypes = propTypes;
ViewerArticle.defaultProps = defaultProps;

export default ViewerArticle;
