/* eslint-disable react/jsx-props-no-spreading */
// import FieldsProvider from '@panneau/fields';
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import BlocksProvider from '../../../packages/blocks/src/BlocksProvider';
import { EditorProvider } from '../../../packages/core/src/contexts/EditorContext';
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
            <EditorProvider>
                <FieldsProvider>
                    <HeadersProvider>
                        <BlocksProvider>
                            <ViewersProvider>
                                <Story />
                            </ViewersProvider>
                        </BlocksProvider>
                    </HeadersProvider>
                </FieldsProvider>
            </EditorProvider>
        ),
    ],
};

const getInitialDocument = (document) => ({
    ...document,
    components:
        document !== null ? document.components.map((it) => ({ ...it, uuid: uuidV4() })) : [],
});

export const Empty = {
    args: {
        document: null,
    },
    render: () => {
        const [currentDocument, onChange] = useState();
        return (
            <div style={{ width: 960, height: 600, margin: 'auto' }}>
                <Article document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const Simple = {
    args: {
        document: article1,
    },
    render: ({ document = null }) => {
        const [currentDocument, onChange] = useState(getInitialDocument(document));
        return (
            <div style={{ width: '100%', height: 600, margin: 'auto' }}>
                <Article document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const Urbania = {
    args: {
        document: article3,
    },
    render: ({ document = null }) => {
        const [currentDocument, onChange] = useState(getInitialDocument(document));
        return (
            <div style={{ width: '100%', height: 800, margin: 'auto' }}>
                <Article document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const Trash = {
    args: {
        document: article2,
    },
    render: ({ document = null }) => {
        const initialDocument = {
            ...document,
            components: document.components.map((it) => ({ ...it, uuid: uuidV4() })),
        };
        const [currentDocument, onChange] = useState(initialDocument);
        return (
            <div style={{ width: '100%', height: 600, margin: 'auto' }}>
                <Article document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};
