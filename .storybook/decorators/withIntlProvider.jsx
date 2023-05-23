import isObject from 'lodash/isObject';
import React from 'react';
import { IntlProvider } from 'react-intl';

// import messagesEn from '../../packages/intl/locale/en.json';
// import messagesFr from '../../packages/intl/locale/fr.json';

const messagesEn = null;
const messagesFr = null;

const withIntlProvider = (Story, { parameters: { intl = null } }) => {
    const enabled = isObject(intl) || intl === true;

    const { locale = 'fr', messages = null } = isObject(intl) ? intl : {};

    const partialMessages = locale === 'fr' ? messagesFr || null : messagesEn || null;
    const customMessages = messages === null ? partialMessages : messages;
    const finalMessages = customMessages || { hash: 'mon message' };
    console.log('intl enabled', enabled, locale, finalMessages);

    return enabled ? (
        <IntlProvider locale={locale} messages={finalMessages}>
            <Story />
            LOL INTL
        </IntlProvider>
    ) : (
        <Story />
    );
};

export default withIntlProvider;
