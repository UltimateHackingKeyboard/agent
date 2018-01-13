const request = require('request');
const decompress = require('decompress');
const decompressTarbz = require('decompress-tarbz2');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

async function downloadFirmware(version) {
    const url = `https://github.com/UltimateHackingKeyboard/firmware/releases/download/${version}/uhk-firmware-${version}.tar.bz2`;
    const outputDir = path.join(__dirname, `../tmp`);
    const output = path.join(outputDir, `uhk-firmware-${version}.tar.bz2`);

    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir);

    await downloadFile(url, output);

    return Promise.resolve(output);
}

async function downloadFile(url, output) {
    return new Promise((resolve, reject) => {
        console.log(`Start download ${url}`);

        const r = request(url);
        r.on('end', () => {
            resolve(output);
        });
        r.on('error', (error) => {
            reject(error);
        });

        r.pipe(fs.createWriteStream(output));
    })
}

(async function main() {
    const agentJson = require('../package.json');

    const extractedFirmwareDir = path.join(__dirname, '../tmp/packages/firmware');
    await fse.emptyDir(extractedFirmwareDir);

    // Download the firmware and add as extra resources
    const firmwarePath = await downloadFirmware(agentJson.firmwareVersion);
    await decompress(firmwarePath, extractedFirmwareDir, {plugins: [decompressTarbz()]});

    await fse.remove(firmwarePath);
})();
