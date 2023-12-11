/* eslint-disable react/jsx-props-no-spreading */
import Button from '@panneau/element-button';
import Select from '@panneau/field-select';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useApi } from '@niche-js/data';

import styles from './styles.module.css';

const propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
    ]),
    textValue: PropTypes.string,
    onChange: PropTypes.func,
    multiple: PropTypes.bool,
    className: PropTypes.string,
};

const defaultProps = {
    value: null,
    textValue: null,
    onChange: null,
    multiple: false,
    className: null,
};

function PickerCredits({
    value: initialValue,
    textValue: initialTextValue,
    onChange,
    multiple,
    className,
}) {
    const [textValue, setTextValue] = useState(initialTextValue);
    const api = useApi();
    const query = useMemo(() => ({ search: textValue }), [textValue]);
    const [value, setValue] = useState(initialValue);
    const loadOptions = useCallback(
        () =>
            api.authors
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
    const onSelectChange = useCallback((newValue) => setValue(newValue), [setValue]);
    const onTextChange = useCallback((newValue) => setTextValue(newValue), [setTextValue]);
    const onConfirm = useCallback(() => onChange(value), [value, onChange]);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Select
                value={value}
                onChange={multiple ? onSelectChange : onChange}
                onInputChange={onTextChange}
                loadOptions={loadOptions}
                multiple={multiple}
                valueIsOption
                paginated
            />
            {multiple ? (
                <Button className="mt-2" theme="primary" onClick={onConfirm}>
                    <FormattedMessage defaultMessage="Confirm" description="Button message" />
                </Button>
            ) : null}
        </div>
    );
}

PickerCredits.propTypes = propTypes;
PickerCredits.defaultProps = defaultProps;

export default PickerCredits;
