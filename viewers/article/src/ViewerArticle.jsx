/* eslint-disable react/jsx-props-no-spreading */
import { useComponentsManager } from '@panneau/core/contexts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useBlocksComponentsManager } from '@niche-js/core/contexts';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({
        // eslint-disable-next-line react/forbid-prop-types
        components: PropTypes.arrayOf(PropTypes.object),
    }),
    className: PropTypes.string,
};

const defaultProps = {
    document: null,
    className: null,
};

function ViewerArticle({ document, className }) {
    const { components = null } = document || {};
    const componentsManager = useComponentsManager();
    const blocksManager = useBlocksComponentsManager();
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    console.log('componentsManager', componentsManager);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {(blocks || []).map((block) => {
                const BlockComponent = blocksManager.getComponent(block.type);
                console.log(blocksManager);
                return BlockComponent !== null ? <BlockComponent {...block} /> : 'hello';
            })}
        </div>
    );
}

ViewerArticle.propTypes = propTypes;
ViewerArticle.defaultProps = defaultProps;

export default ViewerArticle;
