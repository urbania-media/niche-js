/* eslint-disable react/jsx-props-no-spreading */
// import '@panneau/app/assets/css/styles';
import React, { useState } from 'react';

import withApi from '../../../.storybook/decorators/withApiProvider';
import FieldsProvider from '../../../packages/fields/src/FieldsProvider';
import Categories from './PickerCategories';

export default {
    title: 'Pickers/Categories',
    component: Categories,
    tags: ['autodocs'],
    argTypes: {},
    decorators: [
        withApi,
        (Story) => (
            <FieldsProvider>
                <Story />
            </FieldsProvider>
        ),
    ],
};

const pickerArgs = {
    //
};

export const Empty = {
    args: {
        ...pickerArgs,
    },
    render: ({ value: initialValue = null, ...args }) => {
        const [value, onChange] = useState(initialValue);
        return (
            <div>
                <Categories {...args} value={value} onChange={onChange} />
            </div>
        );
    },
};
