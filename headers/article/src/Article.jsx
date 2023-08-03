/* eslint-disable react/no-danger */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: null,
};

function Article({ className }) {
    const title = 'Le REM et l’importance d’un début réussi';
    const subtitle = 'Une virée à Brossard entre deux pannes majeures.';
    return (
        <header className={classNames([styles.container, { [className]: className !== null }])}>
            <div className={styles.title}>{title}</div>
            <div className={styles.subtitle}>{subtitle}</div>
        </header>
    );
}

Article.propTypes = propTypes;
Article.defaultProps = defaultProps;

export default Article;
