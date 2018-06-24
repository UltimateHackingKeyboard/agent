import * as fs from 'fs';
import * as path from 'path';
import { dirSync } from 'tmp';
import * as decompress from 'decompress';
import * as decompressTarbz from 'decompress-tarbz2';

import { TmpFirmware } from '../models/tmp-firmware';

export async function saveTmpFirmware(data: string): Promise<TmpFirmware> {
    const tmpDirectory = dirSync();
    const zipFilePath = path.join(tmpDirectory.name, 'firmware.bz2');

    await writeDataToFile(data, zipFilePath);
    await decompress(zipFilePath, tmpDirectory.name, {plugins: [decompressTarbz()]});

    return {
        tmpDirectory,
        rightFirmwarePath: path.join(tmpDirectory.name, 'devices/uhk60-right/firmware.hex'),
        leftFirmwarePath: path.join(tmpDirectory.name, 'modules/uhk60-left.bin'),
        packageJsonPath: path.join(tmpDirectory.name, 'package.json')
    };
}

function writeDataToFile(data: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const array: Array<number> = JSON.parse(data);
        const buffer = new Buffer(array);

        fs.writeFile(filePath, buffer, err => {
            if (err) {
                return reject();
            }

            resolve();
        });
    });
}
