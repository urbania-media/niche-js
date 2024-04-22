import { defineMessage } from 'react-intl';

export default {
    id: 'image',
    fields: [
        {
            name: 'label',
            type: 'text',
            label: defineMessage({
                defaultMessage: 'Image label',
                description: 'Field label',
            }),
        },
    ],
};
