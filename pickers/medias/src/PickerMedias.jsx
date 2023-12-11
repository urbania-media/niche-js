import Button from '@panneau/element-button';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useApi } from '@niche-js/data';

import styles from './styles.module.css';

const propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
    ]),
    onChange: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    value: null,
    onChange: null,
    className: null,
};

function PickerMedias({ value: initialValue, onChange, className }) {
    const api = useApi();
    const query = useMemo(() => ({ test: null }), []);

    // eslint-disable-next-line no-unused-vars
    const loadOptions = useCallback(
        () =>
            api.medias
                .get(query)
                .then((response) => {
                    const { data = [] } = response || {};
                    return [...(initialValue !== null ? initialValue : []), ...data];
                })
                .catch(() => {
                    // console.log('err', e);
                }),
        [api, query],
    );

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <p>Future media picker</p>
            <Button className="mt-2" theme="primary" onClick={onChange}>
                <FormattedMessage defaultMessage="Confirm" description="Button message" />
            </Button>
        </div>
    );
}

PickerMedias.propTypes = propTypes;
PickerMedias.defaultProps = defaultProps;

export default PickerMedias;
