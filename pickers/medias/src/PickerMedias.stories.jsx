/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

import withApi from '../../../.storybook/decorators/withApiProvider';
import FieldsProvider from '../../../packages/fields/src/FieldsProvider';
import Medias from './PickerMedias';

export default {
    title: 'Pickers/Medias',
    component: Medias,
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
                <Medias {...args} value={value} onChange={onChange} />
            </div>
        );
    },
};
