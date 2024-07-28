/* eslint-disable react/no-danger */
import { useIsVisible } from '@folklore/hooks';
import { loadTikTok, loadInstagram, loadTwitter } from '@folklore/services';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef, useMemo, useEffect } from 'react';

import { Widget } from '@niche-js/core/components';

import styles from './styles.module.css';

const propTypes = {
    embed: PropTypes.shape({
        url: PropTypes.string,
        provider: PropTypes.string,
        iframeUrl: PropTypes.string,
        html: PropTypes.string,
    }),
    loading: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    embed: null,
    loading: 'lazy',
    className: null,
};

function Embed({ embed, loading, className }) {
    const refEmbed = useRef();
    const { provider, iframeUrl = null, html = null } = embed || {};
    const finalFrameUrl = useMemo(() => iframeUrl || null, [iframeUrl]);
    const iframeContainerRef = useRef(null);
    const { ref: visibleRef, visible: isVisible } = useIsVisible({
        rootMargin: '500px',
        persist: true,
        disabled: loading !== 'lazy',
    });

    const shouldLoad = loading !== 'lazy' || isVisible;

    useEffect(() => {
        const { current: element = null } = iframeContainerRef;
        if (provider === 'twitter' && shouldLoad) {
            loadTwitter().then((twttr) => {
                if (element !== null) {
                    twttr.widgets.load(element);
                }
            });
        } else if (provider === 'instagram' && shouldLoad) {
            loadInstagram().then(() => {
                if (typeof window !== 'undefined' && typeof window.instgrm !== 'undefined') {
                    window.instgrm.Embeds.process();
                }
            });
        } else if (provider === 'tiktok' && shouldLoad) {
            loadTikTok();
        }
    }, [provider, shouldLoad]);

    return (
        <Widget
            ref={visibleRef}
            className={classNames([styles.container, { [className]: className !== null }])}
        >
            {finalFrameUrl !== null ? (
                <div className={styles.iframeContainer} ref={iframeContainerRef}>
                    {shouldLoad ? (
                        <iframe
                            src={finalFrameUrl}
                            ref={refEmbed}
                            className={styles.iframe}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embed"
                            width="320"
                            height="240"
                        />
                    ) : null}
                </div>
            ) : null}
            {finalFrameUrl === null && html !== null ? (
                <div
                    className={classNames([styles.iframeContainer])}
                    dangerouslySetInnerHTML={{ __html: html }}
                    ref={iframeContainerRef}
                />
            ) : null}
        </Widget>
    );
}

Embed.propTypes = propTypes;
Embed.defaultProps = defaultProps;

export default Embed;
