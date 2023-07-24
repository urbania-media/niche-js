/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import Editor from './Editor';

import styles from './styles.module.css';

export default {
    title: 'Editors/Editor',
    component: Editor,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {},
    decorators: [
        (Story) => (
            <div className={styles.frame}>
                <Story />
            </div>
        ),
    ],
};

export const Default = {
    args: {},
    render: (args) => (
        <div style={{ width: 800, height: 600, margin: 'auto' }}>
            <Editor {...args} opened className={styles.menu} />,
        </div>
    ),
};
