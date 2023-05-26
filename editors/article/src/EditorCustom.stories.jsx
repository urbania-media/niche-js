import React from 'react';
import EditorCustom from './EditorCustom';
import styles from './stories.module.scss';

export default {
    component: EditorCustom,
    title: 'Editors/Custom',
};

export const normal = () => <EditorCustom className={styles.container} />;

