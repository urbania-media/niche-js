const path = require('path');
const fs = require('fs');
const { sync: globSync } = require('glob');
const getPackagesPaths = require('./getPackagesPaths');
const getPackage = require('./getPackage');

function getPackages() {
    return getPackagesPaths()
        .map((packagePath) => getPackage(packagePath))
        .filter((it) => it !== null);
}

module.exports = getPackages;
