import React from 'react';
import EditorCK from './EditorCK';
import styles from './stories.module.scss';

export default {
    component: EditorCK,
    title: 'Editors/CK',
};

export const normal = () => <EditorCK className={styles.container} />;

