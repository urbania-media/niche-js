/* eslint-disable react/no-danger */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { Widget } from '@niche-js/core/components';

import styles from './styles.module.css';

const propTypes = {
    embed: PropTypes.shape({
        url: PropTypes.string,
        provider: PropTypes.string,
        iframeUrl: PropTypes.string,
        html: PropTypes.string,
    }),
    className: PropTypes.string,
};

const defaultProps = {
    embed: null,
    className: null,
};

function Embed({ embed, className }) {
    const refEmbed = useRef();
    const { iframeUrl = null, html = null } = embed || {};
    return (
        <Widget className={classNames([styles.container, { [className]: className !== null }])}>
            {iframeUrl !== null ? (
                <div className={styles.iframeContainer}>
                    <iframe
                        src={iframeUrl}
                        ref={refEmbed}
                        className={styles.iframe}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embed"
                        width="320"
                        height="240"
                    />
                </div>
            ) : null}
            {iframeUrl === null && html !== null ? (
                <div
                    className={classNames([styles.iframeContainer])}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ) : null}
        </Widget>
    );
}

Embed.propTypes = propTypes;
Embed.defaultProps = defaultProps;

export default Embed;
