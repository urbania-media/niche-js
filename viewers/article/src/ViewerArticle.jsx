/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Component } from '@niche-js/core/components';
import { useHeadersComponentsManager, useBlocksComponentsManager } from '@niche-js/core/contexts';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({
        components: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                uuid: PropTypes.string.isRequired,
                role: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
            }),
        ),
    }),
    className: PropTypes.string,
};

const defaultProps = {
    document: null,
    className: null,
};

function ViewerArticle({ document, className }) {
    const { components = null } = document || {};

    const headersManager = useHeadersComponentsManager();
    const blocksManager = useBlocksComponentsManager();

    const headers = (components || []).filter(({ role = null }) => role === 'header');
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <div className={styles.headers}>
                {(headers || []).map((header) => {
                    const { id = null, uuid = null, type } = header || {};
                    const HeaderComponent = headersManager.getComponent(type);
                    return HeaderComponent !== null ? (
                        <Component component={header} key={`header-${id}-${type}-${uuid}`}>
                            <HeaderComponent {...header} />
                        </Component>
                    ) : null;
                })}
            </div>
            <div className={styles.blocks}>
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
        </div>
    );
}

ViewerArticle.propTypes = propTypes;
ViewerArticle.defaultProps = defaultProps;

export default ViewerArticle;
