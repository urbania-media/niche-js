// import alias from '@rollup/plugin-alias';
import path from 'path';

import { createConfig } from '../../rollup.config.mjs';

const files = {
    'editor.js': {
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [new RegExp(path.join(process.cwd(), './src/lib'))],
        },
    },
};

export default Object.keys(files).reduce(
    (configs, file) => [
        ...configs,
        createConfig({
            file,
            format: 'both',
            ...files[file],
        }),
    ],
    [],
);
