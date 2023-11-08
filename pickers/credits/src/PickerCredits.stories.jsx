/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

import FieldsProvider from '../../../packages/fields/src/FieldsProvider';
import Credits from './PickerCredits';

export default {
    title: 'Pickers/Credits',
    component: Credits,
    tags: ['autodocs'],
    argTypes: {},
    decorators: [
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
                <Credits {...args} value={value} onChange={onChange} />
            </div>
        );
    },
};
