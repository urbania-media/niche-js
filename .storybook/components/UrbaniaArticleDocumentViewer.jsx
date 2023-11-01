/* eslint-disable react/jsx-props-no-spreading */
import { ArticleDocument } from '@urbania-media/ui';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useEditorPlatform } from '../../packages/core/lib/editor/contexts';

import '@urbania-media/ui/css/styles.css';

const propTypes = {
    document: PropTypes.shape({}),
    className: PropTypes.string,
};

const defaultProps = {
    document: null,
    className: null,
};

function UrbaniaArticleDocumentViewer({ document, className, ...props }) {
    const { id: platformId = null } = useEditorPlatform() || {};
    const { components = [], metadata: documentMetadata = null, platforms = null } = document || {};
    const { title = null, credits, categories, image } = documentMetadata || {};
    const { metadata: platformMetadata } =
        platforms !== null && platformId !== null ? platforms[platformId] || {} : {};
    const { brands } = platformMetadata || {};

    const allComponents = components || [];
    const header = allComponents.find(({ role }) => role === 'header');
    const blocks = allComponents.filter(({ role }) => role === 'block');

    const metadata = {
        credits,
        brands: [{ handle: brands }],
        categories,
    };

    // console.log('my blocks', blocks);

    return (
        <ArticleDocument
            className={classNames(['breakpoint-medium', { [className]: className !== null }])}
            title={title}
            image={image}
            blocks={blocks}
            metadata={metadata}
            {...props}
        />
    );
}

UrbaniaArticleDocumentViewer.propTypes = propTypes;
UrbaniaArticleDocumentViewer.defaultProps = defaultProps;

export default UrbaniaArticleDocumentViewer;
