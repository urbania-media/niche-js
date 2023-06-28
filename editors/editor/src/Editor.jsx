import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.module.css';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const Editor = ({ body, className }) => (
    <div className={classNames([styles.container, { [className]: className !== null }])}>
        Base Editor {body}
    </div>
);

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
