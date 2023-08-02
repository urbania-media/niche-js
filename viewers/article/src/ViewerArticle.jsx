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
    const headers = [];
    // const headers = (components || []).filter(({ role = null }) => role === 'header');
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {(headers || []).map((heading) => {
                const { id, title, subtitle } = heading || {};
                return (
                    <div
                        key="headers-1"
                        data-niche-id={id}
                        data-niche-uuid="myuuid"
                        data-niche-type="article"
                        data-niche-role="header"
                        data-niche-widget
                    >
                        <div className="my-header">
                            <div data-niche-editable-inline="title">
                                <h2>{title}</h2>
                            </div>
                            <div data-niche-editable-inline="subtitle">
                                <p>{subtitle}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
            {(blocks || []).map((block) => {
                const { id = null, uuid = null, type = null } = block || {};
                const BlockComponent = blocksManager.getComponent(type);
                return (
                    <div
                        key={`block-${type}-${uuid}`}
                        data-niche-id={id}
                        data-niche-uuid={uuid}
                        data-niche-type={type}
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
