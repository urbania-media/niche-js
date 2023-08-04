/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import BlocksProvider from '../../../packages/blocks/src/BlocksProvider';
import HeadersProvider from '../../../packages/headers/src/HeadersProvider';
import Article from './ViewerArticle';

import article from '../../../.storybook/api/data/articles/3.json';

export default {
    title: 'Viewers/Article',
    component: Article,
    tags: ['autodocs'],
    argTypes: {},
    decorators: [
        (Story) => (
            <HeadersProvider>
                <BlocksProvider>
                    <Story />
                </BlocksProvider>
            </HeadersProvider>
        ),
    ],
};

export const Default = {
    args: {
        document: article,
    },
    render: (args) => (
        <div style={{ display: 'block', maxWidth: 960, margin: '0 auto' }}>
            <Article {...args} />
        </div>
    ),
};

export const Small = {
    args: {
        document: article,
    },
    render: (args) => (
        <div style={{ display: 'block', maxWidth: 320, margin: '0 auto' }}>
            <Article {...args} />
        </div>
    ),
};

export const Medium = {
    args: {
        document: article,
    },
    render: (args) => (
        <div style={{ display: 'block', maxWidth: 768, margin: '0 auto' }}>
            <Article {...args} />
        </div>
    ),
};

export const Large = {
    args: {
        document: article,
    },
    render: (args) => (
        <div style={{ display: 'block', maxWidth: 1300, margin: '0 auto' }}>
            <Article {...args} />
        </div>
    ),
};
