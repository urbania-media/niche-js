import React from 'react';

import Image from './Image';

export default {
    component: Image,
    title: 'Blocks/Image',
    parameters: {
        intl: true,
        // screenDefinition: definition,
    },
};

//
export const Normal = () => <Image src="test.png" />;

export const HOHO = () => <div className="cool">Cool article bro</div>;
