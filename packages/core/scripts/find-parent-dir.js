const path = require('path');

function splitPath(path) {
    const parts = path.split(/(\/|\\)/);
    if (!parts.length) return parts;
    // when path starts with a slash, the first part is empty string
    return !parts[0].length ? parts.slice(1) : parts;
}

module.exports = function (currentFullPath, clue, cb) {
    function testDir(parts) {
        if (parts.length === 0) return cb(null, null);
        const p = parts.join('');
        path.exists(path.join(p, clue), (itdoes) => {
            if (itdoes) return cb(null, p);
            testDir(parts.slice(0, -1));
        });
    }
    testDir(splitPath(currentFullPath));
};

exports.sync = function (currentFullPath, clue) {
    function testDir(parts) {
        if (parts.length === 0) return null;
        const p = parts.join('');
        const itdoes = path.existsSync(path.join(p, clue));
        return itdoes ? p : testDir(parts.slice(0, -1));
    }
    return testDir(splitPath(currentFullPath));
};
