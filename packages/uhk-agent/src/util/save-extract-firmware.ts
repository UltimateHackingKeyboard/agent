import * as fs from 'fs';
import * as path from 'path';
import { dirSync } from 'tmp';
import * as decompress from 'decompress';
import * as decompressTarbz from 'decompress-tarbz2';
import * as decompressTargz from 'decompress-targz';
import { extname } from 'path';
import { UploadFileData } from 'uhk-common';

import { TmpFirmware } from '../models/tmp-firmware';

export async function saveTmpFirmware(fileData: UploadFileData): Promise<TmpFirmware> {
    const tmpDirectory = dirSync();
    const extension = extname(fileData.filename);
    const zipFilePath = path.join(tmpDirectory.name, `firmware${extension}`);

    await writeDataToFile(fileData.data, zipFilePath);

    switch (extension) {

        case '.bz2': {
            await decompress(zipFilePath, tmpDirectory.name, { plugins: [decompressTarbz()] });
            break;
        }

        case '.gz': {
            await decompress(zipFilePath, tmpDirectory.name, { plugins: [decompressTargz()] });
            break;
        }

        default:
            throw new Error(`Unsupported firmware file extension: ${extension}`);
    }

    return {
        tmpDirectory: tmpDirectory.name,
        rightFirmwarePath: path.join(tmpDirectory.name, 'devices/uhk60-right/firmware.hex'),
        leftFirmwarePath: path.join(tmpDirectory.name, 'modules/uhk60-left.bin'),
        packageJsonPath: path.join(tmpDirectory.name, 'package.json')
    };
}

function writeDataToFile(data: Array<number>, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(data);

        fs.writeFile(filePath, buffer, err => {
            if (err) {
                return reject();
            }

            resolve();
        });
    });
}
