import classNames from 'classnames';
import PropTypes from 'prop-types';
import Quill from 'quill';
import React, { useRef, useEffect } from 'react';
import data from './article.json';  

import styles from './styles_text.module.scss';
import './quill.scss';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const EditorQuill = ({ body, className }) => {

    const editorRef = useRef(null);
    let htmlContent = '' 

    function parseData(array){   
        array.forEach(obj => {
            if (obj.type === 'text') {
                htmlContent += obj.body;
            }
        });

    }

    function updateJson(html){
        console.log(html)
    }

    parseData(data.components)

    useEffect(() => {

        if (editorRef.current) {

            const quill = new Quill(editorRef.current, {
                theme: 'bubble',
            });
            const setHTMLContent = (html) => {


                const delta = quill.clipboard.convert(html)
                // console.log(delta)

                quill.setContents(delta, 'silent')

                // quill.clipboard.dangerouslyPasteHTML(html);
            };

            setHTMLContent(htmlContent);
            quill.on('text-change', (delta, oldDelta, source) => {

                // console.log(quill.getContents())
                
                console.log(delta)
                const content = quill.root.innerHTML;
                // updateJson(content)

                 if (source == 'api') {

                    console.log("An API");
                    console.log(delta)

                } else if (source == 'user') {

                    console.log(delta)

                    console.log("A user action triggered this change.");
                }


            });
        }

    }, []);

    // const [components, setComponents] = useSTate(data.components);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>  
            <div ref={editorRef}/>
        </div>
    );

};

EditorQuill.propTypes = propTypes;
EditorQuill.defaultProps = defaultProps;

export default EditorQuill;
