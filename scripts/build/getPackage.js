const path = require('path');
const fs = require('fs');
const { sync: globSync } = require('glob');

function getPackage(packagePath) {
    if (!fs.existsSync(path.join(packagePath, './package.json'))) {
        return null;
    }
    const { name: packageName, exports: packageExports = {} } = require(path.join(
        packagePath,
        './package.json',
    ));
    const subExports = Object.keys(packageExports)
        .map((it) => {
            const matches = it.match(/^\.\/([A-Za-z/_-]+)$/);
            return matches !== null ? matches[1] : null;
        })
        .filter((it) => it !== null);
    const hasEditor =
        Object.keys(packageExports).findIndex((name) => name.match(/^\.\/editor\/?/) !== null) !==
        -1;
    return {
        name: packageName,
        isEditor: packageName.match(/@niche-js\/editor/) !== null,
        hasEditor,
        exports: subExports.filter((it) => it.match(/^(editor|css|assets)\/?/) === null),
    };
}

module.exports = getPackage;
