import Heading from './Heading';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Blocks/Heading',
    component: Heading,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        body: 'Hello',
        size: 2,
    },
};
