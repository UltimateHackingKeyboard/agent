const fse = require('fs-extra');
const path = require('path');

const copyOptions = {
    overwrite: true,
    recursive: true
};

const promises = [];

promises.push(
    fse.copy(
        path.join(__dirname, '../rules'),
        path.join(__dirname, '../tmp/rules'),
        copyOptions)
);

Promise
    .all(promises)
    .catch(console.error);
