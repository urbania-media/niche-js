/* eslint-disable no-nested-ternary */

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
    contentOnly: PropTypes.bool,
    withoutContent: PropTypes.bool,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    children: PropTypes.node,
    headerChildren: PropTypes.node,
};

const defaultProps = {
    document: null,
    contentOnly: false,
    withoutContent: false,
    className: null,
    contentClassName: null,
    headerClassName: null,
    children: null,
    headerChildren: null,
};

function ViewerArticle({
    document,
    contentOnly,
    withoutContent,
    className,
    contentClassName,
    headerClassName,
    children,
    headerChildren,
}) {
    const { components = null, metadata = null } = document || {};
    const { brand = null } = metadata || {};

    const blocksManager = useBlocksComponentsManager();
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    const headersManager = useHeadersComponentsManager();
    const header = (components || []).find(({ role = null }) => role === 'header');
    const { type: headerType = null } = header || {};
    const HeaderComponent = headersManager.getComponent(headerType);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <div
                className={classNames([
                    styles.header,
                    { [headerClassName]: headerClassName !== null },
                ])}
            >
                {!contentOnly || withoutContent ? (
                    HeaderComponent !== null && header !== null ? (
                        <Component component={header}>
                            <HeaderComponent {...header} brand={brand} />
                        </Component>
                    ) : null
                ) : null}
                {headerChildren}
            </div>
            <div
                className={classNames([
                    styles.content,
                    { [contentClassName]: contentClassName !== null },
                ])}
            >
                {!withoutContent || contentOnly
                    ? (blocks || []).map((block) => {
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
                    : null}
                {children}
            </div>
        </div>
    );
}

ViewerArticle.propTypes = propTypes;
ViewerArticle.defaultProps = defaultProps;

export default ViewerArticle;
