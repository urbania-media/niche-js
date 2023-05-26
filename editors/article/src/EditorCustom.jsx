import classNames from 'classnames';
import PropTypes from 'prop-types';
import Quill from 'quill';
import React, { useRef, useEffect } from 'react';

import EditorText from './EditorText';

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

const EditorCustom = ({ body, className }) => {
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>  
            <div className={styles.header} >
                <h1 className={styles.title}>Les tricheurs du Custom</h1>
                <h3 className={styles.subtitle}>Réspectrer les règles sanitaires... la plupart du temps</h3>
                <h5 className={styles.writer}>Par Yop Menier</h5>
            </div>
            <div className={styles.image}>
                <img/>
            </div>
            <EditorText />    
        </div>
    );

};

EditorCustom.propTypes = propTypes;
EditorCustom.defaultProps = defaultProps;

export default EditorCustom;
