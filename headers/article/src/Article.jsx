/* eslint-disable react/no-danger */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.shape({
        url: PropTypes.string,
    }),
    className: PropTypes.string,
};

const defaultProps = {
    title: null,
    subtitle: null,
    category: null,
    image: null,
    className: null,
};

function Article({ title, subtitle, category, image, className }) {
    const { url = null } = image || {};

    return (
        <header className={classNames([styles.container, { [className]: className !== null }])}>
            <div className={styles.category}>{category}</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.subtitle}>{subtitle}</div>
            {url !== null ? <img className={styles.image} src={url} /> : null}
        </header>
    );
}

Article.propTypes = propTypes;
Article.defaultProps = defaultProps;

export default Article;
