/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';

import BlocksProvider from '../../../packages/blocks/src/BlocksProvider';
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
            <BlocksProvider>
                <ViewersProvider>
                    <Story />
                </ViewersProvider>
            </BlocksProvider>
        ),
    ],
};

export const Default = {
    args: {
        document: article,
    },
    render: ({ document = null }) => {
        const [currentDocument, onChange] = useState(document);
        const storyOnChange = useCallback((newValue) => {
            console.log('story on change', newValue);
            onChange(newValue);
        });

        console.log('top', currentDocument);

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
