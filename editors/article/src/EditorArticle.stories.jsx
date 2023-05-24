import React from 'react';

import EditorArticle from './EditorArticle';
import EditorMotion from './EditorMotion';

import styles from './stories.module.scss';

export default {
    component: EditorArticle,
    title: 'Editors/Article',
};

export const normal = () => <EditorArticle className={styles.container} />;
export const test = () => <EditorArticle className={styles.container} />;
export const motion = () => <EditorMotion />;
