import { defineMessage } from 'react-intl';

import ImagePlugin from './plugin/ImagePlugin';

export { ImagePlugin as plugin };

export default {
    id: 'image',
    plugin: ImagePlugin,
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
