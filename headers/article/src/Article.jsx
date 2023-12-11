/* eslint-disable react/no-danger */
import classNames from 'classnames';
import isString from 'lodash/isString';
import PropTypes from 'prop-types';
import React from 'react';

import {
    Editable,
    EditableImage,
    EditableField,
    Widget,
    EditablePicker,
} from '@niche-js/core/components';

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
    const { url: imageUrl = null, alt: imageAlt = null } = image || {};
    const {
        name: authorName = 'Auteur',
        // url: authorUrl = null,
        role: authorRole = null,
    } = author || {};

    const finalSurtitle = isString(surtitle) ? { label: surtitle } : surtitle || null;
    const { label: surTitleLabel = null } = finalSurtitle || {};
    // console.log('author', author);
    // console.log('surtitle', finalSurtitle);

    return (
        <Widget
            withoutUI
            className={classNames([styles.container, { [className]: className !== null }])}
        >
            <div className={styles.inner}>
                <EditablePicker
                    className={styles.surtitle}
                    tag="div"
                    name="surtitle"
                    picker="categories"
                >
                    <EditableField
                        className={styles.surtitle}
                        tag="a"
                        name="label"
                        placeholder="Surtitle"
                        html={surTitleLabel}
                    />
                </EditablePicker>
                <div className={styles.inner}>
                    <Editable className={styles.title} tag="h1" name="title" html={title} inline />
                </div>
                <Editable
                    className={styles.subtitle}
                    tag="h4"
                    name="subtitle"
                    html={subtitle}
                    placeholder="LOL"
                    inline
                />
                <EditableImage
                    className={styles.image}
                    name="image"
                    src={imageUrl}
                    alt={imageAlt}
                />
                <EditablePicker
                    className={styles.author}
                    tag="div"
                    name="author"
                    placeholder="Author"
                    picker="credits"
                >
                    <EditableField
                        className={styles.authorName}
                        tag="a"
                        name="name"
                        html={authorName}
                    />
                    <EditableField
                        className={styles.authorRole}
                        tag="div"
                        name="role"
                        placeholder="Rôle"
                        html={authorRole}
                    />
                </EditablePicker>
            </div>
        </Widget>
    );
}

Article.propTypes = propTypes;
Article.defaultProps = defaultProps;

export default Article;
