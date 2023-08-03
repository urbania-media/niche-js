// import withGoogleKeys from './decorators/withGoogleKeys';
import withIntlProvider from './decorators/withIntlProvider';

import '../packages/core/src/styles/styles.css';
import './fonts/fonts.css';

const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [withIntlProvider],
};

export default preview;
