import Embed from './Embed';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Blocks/Embed',
    component: Embed,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        something: 'something',
    },
};
