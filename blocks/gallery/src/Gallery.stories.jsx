import Gallery from './Gallery';

import fireKoala from './test/firekoala.png';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
    title: 'Blocks/Gallery',
    component: Gallery,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        medias: [
            { src: fireKoala, alt: 'ABC' },
            { src: fireKoala, alt: 'ABC' },
            { src: fireKoala, alt: 'ABC' },
        ],
    },
};
