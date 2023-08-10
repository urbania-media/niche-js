module.exports = [
    {
        role: 'block',
        type: 'text',
        name: 'Texte',
        component: null,
        fields: [
            {
                name: 'body',
                label: 'Corps de texte',
                type: 'text',
            },
        ],
    },
    {
        role: 'header',
        type: 'article',
        name: 'Article',
        component: null,
        fields: [
            {
                name: 'title',
                label: 'Title',
                type: 'text',
            },
        ],
    },
    {
        role: 'header',
        type: 'article_over',
        name: 'Over',
        component: null,
        platform: 'urbania_fr',
        fields: [
            {
                name: 'subtitle',
                label: 'Subtitle',
                type: 'text',
            },
        ],
    },
];
