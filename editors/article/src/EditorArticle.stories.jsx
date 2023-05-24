import React from 'react';

import EditorArticle from './EditorArticle';
import EditorMotion from './EditorMotion';

import styles from './stories.module.scss';

export default {
    component: EditorArticle,
    title: 'Editors/Article',
};

<<<<<<< HEAD
export const normal = () => <EditorArticle />;
export const test = () => <EditorArticle />;
export const motion = () => <EditorMotion />;
=======
export const normal = () => <EditorArticle className={styles.container} />;
export const test = () => <EditorArticle className={styles.container} />;
>>>>>>> 1e695d747306749fa3968729317b9549b0c18363
