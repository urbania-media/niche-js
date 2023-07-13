/* eslint-disable react/no-danger */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    body: PropTypes.string,
    caption: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    caption: null,
    className: null,
};

function Quote({ body, caption, className }) {
    return (
        <figure
            data-niche-block
            className={classNames([styles.container, { [className]: className !== null }])}
        >
            <blockquote
                className={styles.body}
                data-niche-editable="body"
                dangerouslySetInnerHTML={{ __html: body }}
            />
            <figcaption
                className={styles.caption}
                data-niche-editable-inline="caption"
                dangerouslySetInnerHTML={{ __html: caption }}
            />
        </figure>
    );
}

Quote.propTypes = propTypes;
Quote.defaultProps = defaultProps;

export default Quote;
