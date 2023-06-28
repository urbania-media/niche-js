/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import Editor from './Editor';

import styles from './styles.module.css';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
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
    render: (args) => <Editor {...args} opened className={styles.menu} />,
};
