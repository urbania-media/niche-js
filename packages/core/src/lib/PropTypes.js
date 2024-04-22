import snakeCase from 'lodash/snakeCase';
import PropTypes from 'prop-types';

/**
 * Core
 */
export const history = PropTypes.shape({
    listen: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
});

export const location = PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
});

export const intl = PropTypes.shape({
    locale: PropTypes.string.isRequired,
    formatMessage: PropTypes.func.isRequired,
});

export const defaultMessageContent = PropTypes.shape({
    type: PropTypes.number,
    value: PropTypes.string,
});

export const defaultMessage = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(defaultMessageContent),
]);

export const message = PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: defaultMessage.isRequired,
    description: PropTypes.string,
});

export const text = PropTypes.oneOfType([message, PropTypes.string]);

export const label = PropTypes.oneOfType([message, PropTypes.node]);

export const statusCode = PropTypes.oneOf([401, 403, 404, 500]);

/**
 * Components
 */
export const componentNames = (Components) =>
    PropTypes.oneOf(Object.keys(Components).map((it) => snakeCase(it)));

export const component = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    uuid: PropTypes.string,
    role: PropTypes.string,
    type: PropTypes.string,
});

export const components = PropTypes.arrayOf(component);

/**
 * Documents
 */

export const document = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    components,
});

export const documents = PropTypes.arrayOf(document);
