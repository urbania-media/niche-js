import Article from './Article';

export default {
    title: 'Headers/Article',
    component: Article,
    tags: ['autodocs'],
    argTypes: {},
};

export const Default = {
    args: {
        title: 'De la merch faite à partir de vêtements de seconde main',
        subtitle:
            'Et si votre vieux chandail se retrouvait sur le dos de votre artiste préféré.e? ',
        category: 'Brasser des affaires',
        image: {
            url: 'https://img.urbania.ca/media/2023/08/VD-16x9-1.jpg?fm=webp&q=75&fit=max&w=1400&h=1400',
        },
    },
};
