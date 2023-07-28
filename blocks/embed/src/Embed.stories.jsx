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
        embed: {
            provider: 'youtube',
            url: 'https://www.youtube.com/watch?v=Xw5AiRVqfqk',
            iframeUrl: 'https://www.youtube.com/embed/Xw5AiRVqfqk',
            html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/Xw5AiRVqfqk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
        },
    },
};
