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
promises.push(
    fse.copy(
        path.join(__dirname, '../smart-macro-docs'),
        path.join(__dirname, '../tmp/smart-macro-docs'),
        copyOptions)
);

Promise
    .all(promises)
    .catch(error => {
        console.error(error);
        process.exit(1)
    });
