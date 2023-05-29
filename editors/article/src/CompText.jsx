import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import styles from './styles_comp_text.module.scss';


const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const CompText = ({ body, className }) => {

   
    const ref = useRef(null);

    useEffect(() => {
        ref.current.focus();
    }, []);

    
    return (
        <div 
            // contentEditable="true"
            ref={ref}
            className={classNames([styles.container, { [className]: className !== null }])}
            dangerouslySetInnerHTML={{__html:body}}>  
        </div>
    );

};

CompText.propTypes = propTypes;
CompText.defaultProps = defaultProps;

export default CompText;
