import classNames from 'classnames';
import PropTypes from 'prop-types';


// import React from 'react';
// import { useQuill } from 'react-quilljs';
// import 'quill/dist/quill.snow.css'; // Add css for snow theme

import Quill from 'quill';
import React, { useRef, useEffect } from 'react';

import styles from './styles.module.scss';

import './quill.scss'

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const EditorArticle = ({ body, className }) => {
    
// const EditorArticle = ({}) => {

   

    // console.log('hello world', styles.container);
    // return (
    //     <div
    //         className={classNames([styles.container, { [className]: className !== null }])}
    //         dangerouslySetInnerHTML={{ __html: body }}
    //     />
    // ); 

    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
        const quill = new Quill(editorRef.current, {
            theme: 'snow',
        });
        }
    }, []);


    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <div ref={editorRef}></div>
        </div>
    );



    // return (
    //     <div 
    //         className={classNames([styles.container, { [className]: className !== null }])}
    //         dangerouslySetInnerHTML={{ __html: body }}
    //     />
    // ); 

    // return <div ref={editorRef}></div>;

    // const { quill, quillRef } = useQuill();
    // console.log(quill);    // undefined > Quill Object
    // console.log(quillRef); // { current: undefined } > { current: Quill Editor Reference }
    // return (
    //     <div style={{ width: 500, height: 300 }}>
    //       <div ref={quillRef} />
    //     </div>
    // );

};

EditorArticle.propTypes = propTypes;
EditorArticle.defaultProps = defaultProps;

export default EditorArticle;
