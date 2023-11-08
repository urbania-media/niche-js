// import withGoogleKeys from './decorators/withGoogleKeys';
import withApiProvider from './decorators/withApiProvider';
import withIntlProvider from './decorators/withIntlProvider';

import './fonts/fonts.css';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    decorators: [withIntlProvider, withApiProvider],
};

export default preview;
