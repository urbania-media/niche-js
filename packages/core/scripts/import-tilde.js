const path = require('path');

const findParentDir = './find-parent-dir';
const fs = require('fs');

function resolve(targetUrl, source) {
    const packageRoot = findParentDir.sync(source, 'node_modules');

    if (!packageRoot) {
        return null;
    }

    const filePath = path.resolve(packageRoot, 'node_modules', targetUrl);
    const isPotentiallyDirectory = !path.extname(filePath);

    if (isPotentiallyDirectory) {
        if (fs.existsSync(`${filePath}.scss`)) {
            return `${filePath}.scss`;
        }

        if (fs.existsSync(filePath)) {
            return path.resolve(filePath, 'index');
        }
    }

    if (fs.existsSync(path.dirname(filePath))) {
        return filePath;
    }

    return resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer(url, prev, done) {
    return url[0] === '~' ? { file: resolve(url.substr(1), prev) } : null;
};
