import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    size: PropTypes.number,
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    size: null,
    body: null,
    className: null,
};

function Heading({ size, body, className }) {
    const Component = `h${size || 4}`;
    return (
        <Component
            className={classNames([styles.container, { [className]: className !== null }])}
            dangerouslySetInnerHTML={{ __html: body }}
        />
    );
}

Heading.propTypes = propTypes;
Heading.defaultProps = defaultProps;

export default Heading;
