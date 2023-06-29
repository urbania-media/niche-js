/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import BlocksProvider from '../../../packages/blocks/src/BlocksProvider';
import Article from './ViewerArticle';

import article from '../../../.storybook/data/articles/1.json';

export default {
    title: 'Viewers/Article',
    component: Article,
    tags: ['autodocs'],
    argTypes: {},
    decorators: [
        (Story) => (
            <BlocksProvider>
                <Story />
            </BlocksProvider>
        ),
    ],
};

export const Default = {
    args: {
        document: article,
    },
    render: (args) => (
        <div style={{ maxWidth: 300, margin: 'auto ' }}>
            <Article {...args} />
        </div>
    ),
};
