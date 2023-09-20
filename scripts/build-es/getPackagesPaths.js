import path from 'path';

import { sync as globSync } from 'glob';

import packageJson from '../../package.json';

const rootDir = __filename.indexOf('rollup') ? __dirname : path.join(__dirname, '../../');

const getPackagesPaths = () => packageJson.workspaces
.map((it) => it.replace(/\/\*/, '/'))
.reduce(
    (paths, packagesPath) => [
        ...paths,
        ...globSync(path.join(rootDir, packagesPath, './*')),
    ],
    [],
);

export default getPackagesPaths;
