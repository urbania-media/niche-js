import Images from './Images';

import fireKoala from './test/firekoala.png';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Blocks/Images',
    component: Images,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        items: [
            {
                media: { url: fireKoala, alt: 'ABC' },
            },
            {
                media: { url: fireKoala, alt: 'ABC' },
            },
            {
                media: { url: fireKoala, alt: 'ABC' },
            },
        ],
    },
};
