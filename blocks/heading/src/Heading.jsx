import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    body: PropTypes.string,
    size: PropTypes.number,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    size: null,
    className: null,
};

function Heading({ body, size, className }) {
    const Component = `h${size || 6}`;
    console.log('heading', size, body);
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Component dangerouslySetInnerHTML={{ __html: body }} />
        </div>
    );
}

Heading.propTypes = propTypes;
Heading.defaultProps = defaultProps;

export default Heading;
