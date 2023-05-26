import classNames from 'classnames';
import PropTypes from 'prop-types';
import Quill from 'quill';
import React, { useRef, useEffect } from 'react';

import EditorQuill from './EditorQuill';

import styles from './styles.module.scss';
import './quill.scss';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const EditorArticle = ({ body, className }) => {
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>  
            <div className={styles.header} >
                <h1 className={styles.title}>Les tricheurs du Quill</h1>
                <h3 className={styles.subtitle}>Réspectrer les règles sanitaires... la plupart du temps</h3>
                <h5 className={styles.writer}>Par Hugo Menier</h5>
            </div>
            <div className={styles.image}>
                <img/>
            </div>
            <EditorQuill />    
        </div>
    );

};

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
