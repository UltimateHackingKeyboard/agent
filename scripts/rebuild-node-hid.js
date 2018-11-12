const {execSync} = require('child_process');
const {join} = require('path');

const cwd = join(__dirname, '../packages/uhk-agent/dist/node_modules/node-hid');
console.log(`rebuild node-hid in ${cwd}`);
execSync('node-gyp rebuild', {cwd, shell: true, stdio: [0, 1, 2]});
