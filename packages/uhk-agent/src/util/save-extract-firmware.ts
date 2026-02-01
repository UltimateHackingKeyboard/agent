import * as fs from 'fs';
import * as path from 'path';
import { dirSync } from 'tmp';
import decompress from 'decompress';
import decompressTarbz from 'decompress-tarbz2';
import decompressTargz from 'decompress-targz';
import decompressUnzip from 'decompress-unzip';
import { UploadFileData } from 'uhk-common';
import { TmpFirmware } from 'uhk-usb';

export async function saveTmpFirmware(fileData: UploadFileData): Promise<TmpFirmware> {
    const tmpDirectory = dirSync();
    const extension = path.extname(fileData.filename);
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

        case '.zip': {
            const unzipOptions: decompress.DecompressOptions = {
                filter: file => {
                    const fileName = path.basename(file.path);

                    return fileName.startsWith('uhk-firmware-') && fileName.endsWith('.tar.gz');
                },
                plugins: [decompressUnzip()]
            }

            const unzippedFiles = await decompress(zipFilePath, tmpDirectory.name, unzipOptions);
            if (unzippedFiles.length === 0) {
                throw new Error('Zip file does not contain uhk-firmware-*.tar.gz file.');
            }

            return saveTmpFirmware({
                data: unzippedFiles[0].data as any,
                filename: path.basename(unzippedFiles[0].path),
                saveInHistory: fileData.saveInHistory,
            })
        }

        default:
            throw new Error(`Unsupported firmware file extension: ${extension}`);
    }

    return {
        tmpDirectory: tmpDirectory.name,
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
