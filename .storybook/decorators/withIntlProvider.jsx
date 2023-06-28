import React from 'react';
import { IntlProvider } from 'react-intl';

// import messagesEn from '../../packages/intl/locale/en.json';
// import messagesFr from '../../packages/intl/locale/fr.json';
const messagesEn = null;
const messagesFr = null;

const withIntlProvider = (Story = {}) => {
    const locale = 'fr';
    const partialMessages = locale === 'fr' ? messagesFr || null : messagesEn || null;
    const finalMessages = partialMessages || { hash: 'mon message' };

    return (
        <IntlProvider locale={locale} messages={finalMessages}>
            <Story />
        </IntlProvider>
    );
};

export default withIntlProvider;
