import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    document: PropTypes.shape({
        // eslint-disable-next-line react/forbid-prop-types
        components: PropTypes.arrayOf(PropTypes.object),
    }),
    className: PropTypes.string,
};

const defaultProps = {
    document: null,
    className: null,
};

function ViewerArticle({ document, className }) {
    const { components = null } = document || {};
    const blocks = (components || []).filter(({ role = null }) => role === 'block');

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            {(blocks || []).map((block) => (
                <p>{block.type}</p>
            ))}
        </div>
    );
}

ViewerArticle.propTypes = propTypes;
ViewerArticle.defaultProps = defaultProps;

export default ViewerArticle;
