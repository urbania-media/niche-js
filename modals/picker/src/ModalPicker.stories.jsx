/* eslint-disable react/jsx-props-no-spreading */
import { ModalProvider } from '@panneau/core/contexts';
import { Modals } from '@panneau/element-modal';
import React, { useState } from 'react';

import withApi from '../../../.storybook/decorators/withApiProvider';
import FieldsProvider from '../../../packages/fields/src/FieldsProvider';
import PickersProvider from '../../../packages/pickers/src/PickersProvider';
import ModalPicker from './ModalPicker';

export default {
    title: 'Modals/Picker',
    component: ModalPicker,
    tags: ['autodocs'],
    argTypes: {},
    decorators: [
        withApi,
        (Story) => (
            <ModalProvider>
                <FieldsProvider>
                    <PickersProvider>
                        <Story />
                        <Modals />
                    </PickersProvider>
                </FieldsProvider>
            </ModalProvider>
        ),
    ],
};

const pickerArgs = {
    value: null,
    onClose: () => console.log('on close!'),
};

export const Empty = {
    args: {
        ...pickerArgs,
    },
    render: ({ value: initialValue = null, ...args }) => {
        const [value, onChange] = useState(initialValue);
        return <ModalPicker {...args} value={value} onChange={onChange} />;
    },
};

export const Categories = {
    args: {
        ...pickerArgs,
    },
    render: (args) => {
        const [value, onChange] = useState([
            { id: '1', label: 'Culture pop', value: 'culture-pop' },
        ]);
        return <ModalPicker {...args} component="categories" value={value} onChange={onChange} />;
    },
};
