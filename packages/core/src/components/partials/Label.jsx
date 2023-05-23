/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { isMessage } from '../../utils';

const propTypes = {
    children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    isHtml: PropTypes.bool,
    values: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    isHtml: false,
    values: {},
};

const Label = ({ children, isHtml, values }) => {
    const Message = isHtml ? FormattedMessage : FormattedMessage;
    return isMessage(children) ? <Message values={values} {...children} /> : children;
};

Label.propTypes = propTypes;
Label.defaultProps = defaultProps;

export default Label;
