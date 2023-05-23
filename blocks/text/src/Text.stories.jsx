import React from 'react';

import Text from './Text';

export default {
    component: Text,
    title: 'Blocks/Text',
};

export const normal = () => <Text body="<p>This is a text <strong>with bold</strong></p>" />;
