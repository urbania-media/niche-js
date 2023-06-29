/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

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
            <div style={{ margin: '3em' }}>
                <ViewersProvider>
                    <Story />
                </ViewersProvider>
            </div>
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
