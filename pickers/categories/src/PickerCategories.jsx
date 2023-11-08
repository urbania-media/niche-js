/* eslint-disable react/jsx-props-no-spreading */
import Card from '@panneau/element-card';
import AutocompleteField from '@panneau/field-autocomplete';
import classNames from 'classnames';
import { isString } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect } from 'react';

import { useApi } from '@niche-js/data';

import styles from './styles.module.css';

const propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape()),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
    ]),
    onChange: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    items: null,
    value: null,
    onChange: null,
    className: null,
};

function PickerCategories({ items: initialItems, value, onChange, className }) {
    const finalValue = isString(value) ? value : value?.id;
    const [textValue, setTextValue] = useState(finalValue);
    const api = useApi();

    const query = useMemo(() => ({ search: textValue }), [textValue]);

    const [items, setItems] = useState(initialItems);
    useEffect(() => {
        api.categories.get(query).then((response) => {
            setItems(response.data || response.items || null);
        });
    }, [api, query]);

    return (
        <div className={classNames([styles.container, { [className]: className !== null }])}>
            Cat Picker
            <AutocompleteField
                className={classNames([styles.textField, 'mb-2'])}
                value={textValue}
                onChange={setTextValue}
            />
            <div className="grid text-center">
                {(items || []).map((it) => (
                    <Card
                        className="g-col-4 mb-2"
                        bodyClassName="p-2"
                        key={it.id}
                        onClick={() => onChange(it)}
                    >
                        {it.label}
                    </Card>
                ))}
            </div>
        </div>
    );
}

PickerCategories.propTypes = propTypes;
PickerCategories.defaultProps = defaultProps;

export default PickerCategories;
