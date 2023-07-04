import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const Text = ({ body, className }) => {
    console.log('text block', body);
    return (
        <div
            className={classNames([styles.container, { [className]: className !== null }])}
            data-type="text"
            dangerouslySetInnerHTML={{ __html: body }}
        />
    );
};

Text.propTypes = propTypes;
Text.defaultProps = defaultProps;

export default Text;
