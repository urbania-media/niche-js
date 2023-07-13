import Image from './Image';

import fireKoala from './test/firekoala.png';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Blocks/Image',
    component: Image,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        media: { url: fireKoala },
    },
};
