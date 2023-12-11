/* eslint-disable react/jsx-props-no-spreading */
import Button from '@panneau/element-button';
import Select from '@panneau/field-select';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import uniqBy from 'lodash/uniqBy';
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

function PickerCategories({
    value: initialValue,
    textValue: initialTextValue,
    onChange,
    multiple,
    className,
}) {
    const [textValue, setTextValue] = useState(initialTextValue);
    const api = useApi();
    const query = useMemo(() => ({ search: textValue || null }), [textValue]);

    const [value, setValue] = useState(initialValue);
    const loadOptions = useCallback(
        () =>
            api.categories
                .get(query)
                .then((response) => {
                    const { data = [] } = response || {};
                    return uniqBy(
                        [
                            ...(initialValue !== null && isArray(initialValue) ? initialValue : []),
                            ...data,
                        ],
                        'id',
                    );
                })
                .catch(() => {
                    // console.log('err', e);
                }),
        [api, query],
    );

    const onSingleChange = useCallback(
        (newValue) => {
            const { label: newLabel = '' } = newValue || {};
            setValue(newValue);
            onChange(newLabel);
        },
        [setValue, onChange],
    );

    const onMultipleChange = useCallback((newValue) => setValue(newValue), [setValue]);
    const onTextChange = useCallback((newValue) => setTextValue(newValue), [setTextValue]);
    const onMultipleConfirm = useCallback(() => {
        const labels = isArray(value)
            ? value.reduce((acc, it) => {
                  const { label: itLabel = '' } = it || {};
                  acc.push(itLabel);
                  return acc;
              }, [])
            : null;
        onChange(labels.join(' - '));
    }, [value, onChange]);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            <Select
                value={value}
                onChange={multiple ? onMultipleChange : onSingleChange}
                onInputChange={onTextChange}
                loadOptions={loadOptions}
                multiple={multiple}
                valueIsOption
                paginated
            />
            {multiple ? (
                <Button className="mt-2" theme="primary" onClick={onMultipleConfirm}>
                    <FormattedMessage defaultMessage="Confirm" description="Button message" />
                </Button>
            ) : null}
        </div>
    );
}

PickerCategories.propTypes = propTypes;
PickerCategories.defaultProps = defaultProps;

export default PickerCategories;
