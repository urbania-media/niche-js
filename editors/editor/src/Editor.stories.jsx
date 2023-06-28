// Button.stories.ts|tsx
import React from 'react';

import Editor from './Editor';

const meta = {
    component: Editor,
};

export default meta;

export const Primary = {
    render: () => <Editor prop="Something" />,
};
