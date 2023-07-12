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

function Text({ body, className }) {
    return (
        <div
            // data-block-editable
            className={classNames([styles.container, { [className]: className !== null }])}
            data-type="text"
            // data-niche-block="true"
            dangerouslySetInnerHTML={{ __html: body }}
        >
            {/* <div data-niche-inline-editable="true" data-niche-key="lettrine">
                L
            </div>
            <div
                data-niche-block-editable="true"
                data-niche-key="body"
                dangerouslySetInnerHTML={{ __html: body }}
            /> */}
        </div>
    );
}

Text.propTypes = propTypes;
Text.defaultProps = defaultProps;

export default Text;
