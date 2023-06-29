/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Article from './EditorArticle';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Editors/Article',
    component: Article,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        body: '<p>Hello world</p>',
    },
    render: (args) => (
        <div style={{ maxWidth: 300, margin: 'auto ' }}>
            <Article {...args} />
        </div>
    ),
};
