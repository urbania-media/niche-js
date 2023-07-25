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

function Embed({ className }) {
    return (
        <div
            className={classNames([styles.container, { [className]: className !== null }])}
            // data-niche-block-widget
        >
            Embed block
        </div>
    );
}

Embed.propTypes = propTypes;
Embed.defaultProps = defaultProps;

export default Embed;
