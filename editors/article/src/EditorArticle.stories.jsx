/* eslint-disable react/jsx-props-no-spreading */
// import FieldsProvider from '@panneau/fields';
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import BlocksProvider from '../../../packages/blocks/src/BlocksProvider';
import FieldsProvider from '../../../packages/fields/src/FieldsProvider';
import ViewersProvider from '../../../packages/viewers/src/ViewersProvider';
import Article from './EditorArticle';

import article1 from '../../../.storybook/api/data/articles/1.json';
import article2 from '../../../.storybook/api/data/articles/2.json';

export default {
    title: 'Editors/Article',
    component: Article,
    tags: ['autodocs'],
    argTypes: {},
    decorators: [
        (Story) => (
            <FieldsProvider>
                <BlocksProvider>
                    <ViewersProvider>
                        <Story />
                    </ViewersProvider>
                </BlocksProvider>
            </FieldsProvider>
        ),
    ],
};

export const Default = {
    args: {
        document: article1,
    },
    render: ({ document = null }) => {
        const initialDocument = {
            ...document,
            components: document.components.map((it) => ({ ...it, uuid: uuidV4() })),
        };
        const [currentDocument, onChange] = useState(initialDocument);
        return (
            <div style={{ width: 800, height: 600, margin: 'auto' }}>
                <Article document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const Simple = {
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
            <div style={{ width: 800, height: 600, margin: 'auto' }}>
                <Article document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};

export const EmptyArticle = {
    args: {
        document: null,
    },
    render: ({ document = null }) => {
        const [currentDocument, onChange] = useState(document);
        return (
            <div style={{ width: 800, height: 900, margin: 'auto ' }}>
                <Article document={currentDocument} onChange={onChange} />
            </div>
        );
    },
};
