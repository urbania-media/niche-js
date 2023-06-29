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
        body: 'Hello',
    },
};
