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
    const id = 1;
    const uuid = 'myuuid';
    const title = 'My header title';
    const subtitle = 'My header subtitle with some more text';

    return (
        <div
            className={classNames([styles.container, { [className]: className !== null }])}
            key={`header-${id}-${uuid}`}
            data-niche-id={id}
            data-niche-uuid="myuuid"
            data-niche-type="article"
            data-niche-role="header"
            data-niche-widget
        >
            <div className="my-article-header">
                <div data-niche-editable="title" dangerouslySetInnerHTML={{ __html: title }} />
                <div
                    data-niche-editable="subtitle"
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                />
            </div>
        </div>
    );
}

Article.propTypes = propTypes;
Article.defaultProps = defaultProps;

export default Article;
