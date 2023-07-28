/* eslint-disable react/jsx-props-no-spreading */
// import FieldsProvider from '@panneau/fields';
import React, { useCallback, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import BlocksProvider from '../../../packages/blocks/src/BlocksProvider';
import FieldsProvider from '../../../packages/fields/src/FieldsProvider';
import ViewersProvider from '../../../packages/viewers/src/ViewersProvider';
import Article from './EditorArticle';

import article from '../../../.storybook/data/articles/1.json';

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
        document: article,
    },
    render: ({ document = null }) => {
        const initialDocument = {
            ...document,
            components: document.components.map((it) => ({ ...it, uuid: uuidV4() })),
        };
        const [currentDocument, onChange] = useState(initialDocument);
        const storyOnChange = useCallback((newValue) => {
            console.log('story on change', newValue);
            onChange(newValue);
        });
        return (
            <div style={{ width: 800, height: 600, margin: 'auto' }}>
                <Article document={currentDocument} onChange={storyOnChange} />
            </div>
        );
    },
};

export const EmptyArticle = {
    args: {
        document: null,
    },
    render: (args) => (
        <div style={{ width: 800, height: 900, margin: 'auto ' }}>
            <Article {...args} />
        </div>
    ),
};
