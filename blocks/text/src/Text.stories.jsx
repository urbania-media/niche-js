import Text from './Text';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Blocks/Text',
    component: Text,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        body: 'Hello',
    },
};
