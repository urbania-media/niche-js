import React from 'react';

import EditorArticle from './EditorArticle';
import EditorMotion from './EditorMotion';

export default {
    component: EditorArticle,
    title: 'Editors/Article',
};

export const normal = () => <EditorArticle />;
export const test = () => <EditorArticle />;
export const motion = () => <EditorMotion />;
