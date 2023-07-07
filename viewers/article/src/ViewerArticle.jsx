/* eslint-disable react/jsx-props-no-spreading */
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
    const blocksManager = useBlocksComponentsManager();
    const blocks = (components || []).filter(({ role = null }) => role === 'block');
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {(blocks || []).map((block, i) => {
                const { type = null } = block || {};
                const BlockComponent = blocksManager.getComponent(type);
                return (
                    <div key={`block-${i + 1}-${type}`} data-block-type={type}>
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
