const path = require('path');

module.exports.root = function root(dir, __path) {
    return path.join(dir, __path);
};
