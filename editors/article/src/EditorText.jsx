import classNames from 'classnames';
import PropTypes from 'prop-types';
import Quill from 'quill';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import data from './article.json';

import styles from './styles_text.module.scss';
import './quill.scss';

import CompText from './CompText';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const EditorText = ({ body, className }) => {

    const [components, setComponents] = useState(data.components);

    const handleClick = useCallback(() => {
        addCompText()
    }, [])

    const handleKeyPress = useCallback(() => {
        if (event.key === 'Enter') {  
            addCompText()
            event.preventDefault(); 
        }
    }, [])

    function addCompText(){
        const add =  {type: "text"}
        setComponents(prevComponents => [...prevComponents, add]);
    };

    return (

        <div className={classNames([styles.container, { [className]: className !== null }])}>  
            <div contentEditable="true" onKeyPress={handleKeyPress}>  
                {components.map((component, index) => (
                    <div key={index}>
                        <CompText {...component}/>
                    </div>
                ))}
            </div>

            <button  contentEditable="false" onClick={handleClick}>Ajouter un composant</button>

        </div>
    );

};

EditorText.propTypes = propTypes;
EditorText.defaultProps = defaultProps;

export default EditorText;
