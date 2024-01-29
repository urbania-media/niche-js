/* eslint-disable react/no-danger */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Widget, Editable } from '@niche-js/core/components';

import styles from './styles.module.css';
import { useIsEditor } from '@niche-js/core/contexts';

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
    const isEditor = useIsEditor();
    return (
        <Widget
            tag="figure"
            className={classNames([styles.container, { [className]: className !== null }])}
        >
            <Editable
                tag="blockquote"
                name="body"
                className={styles.body}
                html={body}
                placeholder="Quote"
            />
            {caption !== null || isEditor ? <Editable
                tag="figcaption"
                name="caption"
                className={styles.caption}
                html={caption}
                placeholder="Quote caption"
                inline
            /> : null}
        </Widget>
    );
}

Quote.propTypes = propTypes;
Quote.defaultProps = defaultProps;

export default Quote;
