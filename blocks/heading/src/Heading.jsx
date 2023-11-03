import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    body: PropTypes.string,
    size: PropTypes.oneOf([2, 3, 4, 5, 6]),
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    size: null,
    className: null,
};

// Beware with this one
function Heading({ body, size, className }) {
    const Component = `h${size || 6}`;
    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Component dangerouslySetInnerHTML={{ __html: body }} />
        </div>
    );
}

Heading.propTypes = propTypes;
Heading.defaultProps = defaultProps;

export default Heading;
