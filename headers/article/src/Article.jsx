/* eslint-disable react/no-danger */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Editable, EditableImage, Widget } from '@niche-js/core/components';

import styles from './styles.module.css';

const propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    surtitle: PropTypes.string,
    image: PropTypes.shape({
        url: PropTypes.string,
    }),
    className: PropTypes.string,
};

const defaultProps = {
    title: null,
    subtitle: null,
    surtitle: null,
    image: null,
    className: null,
};

function Article({ title, subtitle, surtitle, image, className }) {
    const { url = null, alt = null } = image || {};
    return (
        <Widget
            withoutUI
            className={classNames([styles.container, { [className]: className !== null }])}
        >
            <div className={styles.inner}>
                <Editable
                    className={styles.surtitle}
                    tag="div"
                    name="surtitle"
                    html={surtitle}
                    inline
                />
                <div className={styles.inner}>
                    <Editable className={styles.title} tag="h1" name="title" html={title} inline />
                </div>
                <Editable
                    className={styles.subtitle}
                    tag="h3"
                    name="subtitle"
                    html={subtitle}
                    inline
                />
                {url !== null ? (
                    <EditableImage className={styles.image} name="image" src={url} alt={alt} />
                ) : null}
            </div>
        </Widget>
    );
}

Article.propTypes = propTypes;
Article.defaultProps = defaultProps;

export default Article;
