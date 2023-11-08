/* eslint-disable react/no-danger */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Editable, EditableImage, Widget } from '@niche-js/core/components';

// import { useIsEditor } from '@niche-js/core/contexts';
import styles from './styles.module.css';

const propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    surtitle: PropTypes.string,
    image: PropTypes.shape({
        url: PropTypes.string,
    }),
    author: PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
    }),
    className: PropTypes.string,
};

const defaultProps = {
    title: null,
    subtitle: null,
    surtitle: null,
    image: null,
    author: null,
    className: null,
};

function Article({ title, subtitle, surtitle, image, author, className }) {
    // const isEditor = useIsEditor();
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
                    picker="categories"
                />
                <div className={styles.inner}>
                    <Editable className={styles.title} tag="h1" name="title" html={title} inline />
                </div>
                <Editable
                    className={styles.subtitle}
                    tag="h4"
                    name="subtitle"
                    html={subtitle}
                    inline
                />
                <EditableImage className={styles.image} name="image" src={url} alt={alt} />
                <Editable
                    className={styles.image}
                    name="author"
                    placeholder="Author"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...author}
                />
            </div>
        </Widget>
    );
}

Article.propTypes = propTypes;
Article.defaultProps = defaultProps;

export default Article;
