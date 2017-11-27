const fse = require('fs-extra');
const path = require('path');

fse.copy(
    path.join(__dirname, '../packages/usb/blhost'),
    path.join(__dirname, '../tmp/packages/blhost'),
    {
        overwrite:true,
        recursive:true
    });
