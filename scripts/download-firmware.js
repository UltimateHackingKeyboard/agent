const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const fse = require('fs-extra');

async function downloadFirmware(version) {
    const url = `https://github.com/UltimateHackingKeyboard/firmware/releases/download/v${version}/uhk-firmware-${version}.tar.gz`;
    const outputDir = path.join(__dirname, `../tmp`);
    const output = path.join(outputDir, `uhk-firmware-${version}.tar.gz`);

    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir);

    await downloadFile(url, output);

    return Promise.resolve(output);
}

async function downloadFile(url, output) {
    // TODO: Restore before merge to UltimateHackingKeyboard/firmware master
    // const res = await fetch(url);
    // await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(output));

    const firmwarePath = path.join(__dirname, 'uhk-firmware-80-11.2.0-28b254f.tar.gz')

    await fsp.cp(firmwarePath, output, {force: true});
}

(async function main() {
    const agentJson = require('../package.json');

    const extractedFirmwareDir = path.join(__dirname, '../tmp/packages/firmware');
    await fse.emptyDir(extractedFirmwareDir);

    // Download the firmware and add as extra resources
    const firmwarePath = await downloadFirmware(agentJson.firmwareVersion);
    await decompress(firmwarePath, extractedFirmwareDir, {plugins: [decompressTargz()]});

    await fse.remove(firmwarePath);
})();
