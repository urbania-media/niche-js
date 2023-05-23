import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.scss';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const Text = ({ body, className }) => {
    console.log('hello world', styles.container);
    return (
        <div
            className={classNames([styles.container, { [className]: className !== null }])}
            dangerouslySetInnerHTML={{ __html: body }}
        />
    );
};

Text.propTypes = propTypes;
Text.defaultProps = defaultProps;

export default Text;
