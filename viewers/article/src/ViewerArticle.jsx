/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { v4 as uuidV4 } from 'uuid';

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
    const blocksManager = useBlocksComponentsManager();
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    console.log('ViewerArticle renders', components, blocks);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {(blocks || []).map((block, i) => {
                const { id = uuidV4(), type = null } = block || {};
                const BlockComponent = blocksManager.getComponent(type);
                // eslint-disable-next-line no-nested-ternary
                return (
                    <div
                        id={id}
                        key={`block-${id}-${type}`}
                        data-niche-block-id={id}
                        data-niche-block-type={type}
                        data-niche-role="block"
                        data-niche-block-inline={type === 'text' || type === 'heading'}
                    >
                        {BlockComponent !== null ? <BlockComponent {...block} /> : null}
                    </div>
                );
            })}
        </div>
    );
}

ViewerArticle.propTypes = propTypes;
ViewerArticle.defaultProps = defaultProps;

export default ViewerArticle;
