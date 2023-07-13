import Quote from './Quote';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Blocks/Quote',
    component: Quote,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        body: 'The medium is the message.',
        caption: 'Marshall McLuhan',
    },
};
