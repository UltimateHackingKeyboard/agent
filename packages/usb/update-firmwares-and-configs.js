#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
require('shelljs/global');

config.fatal = true;

program
    .usage(`firmwarePath {iso|ansi}`)
    .parse(process.argv);

if (program.args.length !== 2) {
    console.error('Both firmwarePath and layout must be specified.');
    exit(1);
}

const firmwarePath = program.args[0];
const layout = program.args[1];

config.verbose = true;
exec(`${__dirname}/update-all-firmwares.js --overwrite-user-config ${firmwarePath}`);
exec(`${__dirname}/write-hca.js ${layout}`);
config.verbose = false;

echo(`Firmwares and configs updated successfully. HCA updated to ${layout}`);
