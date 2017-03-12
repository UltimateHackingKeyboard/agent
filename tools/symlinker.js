"use strict";

var fs = require('fs');
var path = require('path');


var webSharedPath = path.resolve(__dirname, '../web/src/shared/');
var electronSharedPath = path.resolve(__dirname, '../electron/src/shared/');
var sharedPath = path.resolve(__dirname, '../shared/src/');

var destPaths = [webSharedPath, electronSharedPath];

function createSymlinks() {
    destPaths.forEach(function (destPath) {
        if (!fs.existsSync(destPath)) {
            fs.symlinkSync(sharedPath, destPath, 'junction');
        }
    });
    console.log('Symbolic links have been created.');
}

function removeSymlinks() {
    destPaths.forEach(function (destPath) {
        if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
        }
    });
    console.log('Symbolic links have been removed.');
}

var commands = ['i', 'r', 'h'];

function printUsage() {
    console.log('Usage: symlinker <command>\n')
    console.log('where <command> is one of:')
    console.log(commands.join(', ') + '\n');
    console.log('node symlinker -i\tCreate symlinks');
    console.log('node symlinker -r\tRemove symlinks');
    console.log('node symlinker -h\tShow usage');
}

if (process.argv.length >= 4 || process.argv.length <= 2) {
    if (process.argv.length >= 4) {
        console.log('Too many arguments.');
    }
    printUsage();
    return 0;
}

switch (process.argv[2].slice(1)) {
    case 'i':
        createSymlinks();
        break;
    case 'r':
        removeSymlinks();
        break;
    case 'h':
        printUsage();
        break;
    default:
        console.log('Invalid option: ', process.argv[2]);
}
