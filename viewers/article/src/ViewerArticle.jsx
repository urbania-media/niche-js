/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useBlocksComponentsManager } from '@niche-js/core/contexts';

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
    const blocksManager = useBlocksComponentsManager();
    const blocks = (components || []).filter(({ role = null }) => role === 'block');
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {/* <div
                id={null}
                key="heading-1"
                data-niche-block-id={null}
                data-niche-block-uuid="myuuid"
                data-niche-block-type="article"
                data-niche-role="heading"
                data-niche-block-widget
            >
                <h1 data-niche-block-paragraph="false">MY TEST HEADING</h1>
            </div> */}
            {(blocks || []).map((block) => {
                const { id = null, uuid = null, type = null } = block || {};
                const BlockComponent = blocksManager.getComponent(type);
                return (
                    <div
                        id={uuid}
                        key={`block-${uuid}-${type}`}
                        data-niche-block-id={id}
                        data-niche-block-uuid={uuid}
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
