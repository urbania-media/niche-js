/* eslint-disable react/jsx-props-no-spreading */
// eslint-disable-next-line import/no-extraneous-dependencies
// import { ArticleDocument } from '@urbania-media/ui';
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

// import FieldsProvider from '@panneau/fields';
import componentDefinitions from '../../../.storybook/api/data/componentDefinitions';
import platforms from '../../../.storybook/api/data/platforms';
import { ArticleDocument } from '../../../node_modules/@urbania-media/ui';
import BlocksProvider from '../../../packages/blocks/src/BlocksProvider';
import {
    ComponentsProvider,
    VIEWERS_NAMESPACE,
} from '../../../packages/core/src/contexts/ComponentsContext';
import FieldsProvider from '../../../packages/fields/src/FieldsProvider';
import HeadersProvider from '../../../packages/headers/src/HeadersProvider';
import ViewersProvider from '../../../packages/viewers/src/ViewersProvider';
import Article from './EditorArticle';

import article1 from '../../../.storybook/api/data/articles/1.json';
import article2 from '../../../.storybook/api/data/articles/2.json';
import article3 from '../../../.storybook/api/data/articles/3.json';

export default {
    title: 'Editors/Article',
    component: Article,
    tags: ['autodocs'],
    argTypes: {},
    decorators: [
        (Story) => (
            <FieldsProvider>
                <HeadersProvider>
                    <BlocksProvider>
                        <ViewersProvider>
                            <ComponentsProvider
                                namespace={VIEWERS_NAMESPACE}
                                components={{
                                    Article: ArticleDocument,
                                    ArticleOver: ArticleDocument, // TODO: export another version
                                }}
                            >
                                <Story />
                            </ComponentsProvider>
                        </ViewersProvider>
                    </BlocksProvider>
                </HeadersProvider>
            </FieldsProvider>
        ),
    ],
};

const editorArgs = {
    platforms,
    components: componentDefinitions,
};

const getInitialDocument = (document) => ({
    ...document,
    components:
        document !== null
            ? (document.components || []).map((it) => ({
                  ...it,
                  id: parseInt(it.id || 0, 10),
                  uuid: uuidV4(),
              }))
            : [],
});

export const Empty = {
    args: {
        document: null,
        ...editorArgs,
    },
    render: (args) => {
        const [currentDocument, onChange] = useState();
        return (
            <div style={{ width: 960, height: 600, margin: 'auto' }}>
                <Article {...args} document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const Simple = {
    args: {
        document: article1,
        ...editorArgs,
    },
    render: ({ document = null, ...args }) => {
        const [currentDocument, onChange] = useState(getInitialDocument(document));
        return (
            <div style={{ width: '100%', height: 600, margin: 'auto' }}>
                <Article {...args} document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const Urbania = {
    args: {
        document: article3,
        ...editorArgs,
    },
    render: ({ document = null, ...args }) => {
        const [currentDocument, onChange] = useState(getInitialDocument(document));
        return (
            <div style={{ width: '100%', height: 800, margin: 'auto' }}>
                <Article {...args} document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const Trash = {
    args: {
        document: article2,
        ...editorArgs,
    },
    render: ({ document = null, ...args }) => {
        const initialDocument = {
            ...document,
            components: document.components.map((it) => ({ ...it, uuid: uuidV4() })),
        };
        const [currentDocument, onChange] = useState(initialDocument);
        return (
            <div style={{ width: '100%', height: 600, margin: 'auto' }}>
                <Article {...args} document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};
