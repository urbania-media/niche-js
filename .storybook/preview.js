// import withGoogleKeys from './decorators/withGoogleKeys';
import withIntlProvider from './decorators/withIntlProvider';

// import withArticleDefinition from './decorators/withArticleDefinition';
// import withScreenSize from './decorators/withScreenSize';
import '../packages/core/src/styles/styles.css';

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
