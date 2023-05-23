class IntlManager {
    constructor() {
        this.locales = [];
    }

    addLocale(locale, messages, replace = false) {
        const currentLocale = this.getLocale(locale);
        this.locales = [
            ...(currentLocale !== null
                ? this.locales.filter((it) => it.locale !== locale)
                : this.locales),
            {
                locale,
                messages:
                    currentLocale !== null && !replace
                        ? {
                              ...currentLocale.messages,
                              ...messages,
                          }
                        : messages,
            },
        ];
    }

    getLocale(locale) {
        return this.locales.find((it) => it.locale === locale) || null;
    }

    hasLocale(locale) {
        return this.getLocale(locale) !== null;
    }

    getMessages(locale) {
        const localeObj = this.locales.find((it) => it.locale === locale) || null;
        if (localeObj === null) {
            return null;
        }
        return localeObj.messages;
    }
}

export default IntlManager;
