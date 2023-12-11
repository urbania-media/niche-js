/* eslint-disable react/jsx-props-no-spreading */
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

const pickerArgs = {};

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

export const WithInitialValue = {
    args: {
        ...pickerArgs,
    },
    render: ({ ...args }) => {
        const [value, onChange] = useState([
            { id: '135432', label: 'Top', value: 'top', name: 'Top' },
        ]);
        return (
            <div>
                <Categories {...args} value={value} onChange={onChange} />
            </div>
        );
    },
};
