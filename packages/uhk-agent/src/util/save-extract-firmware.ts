import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import decompress from 'decompress';
import decompressTarbz from 'decompress-tarbz2';
import decompressTargz from 'decompress-targz';
import decompressUnzip from 'decompress-unzip';
import { UploadFileData } from 'uhk-common';
import { makeTmpDir } from 'uhk-fs';
import { TmpFirmware } from 'uhk-usb';

export async function saveTmpFirmware(fileData: UploadFileData): Promise<TmpFirmware> {
    const tmpDirectory = await makeTmpDir();
    const extension = path.extname(fileData.filename);
    const zipFilePath = path.join(tmpDirectory, `firmware${extension}`);

    const buffer = Buffer.from(fileData.data);
    await writeFile(zipFilePath, buffer);

    switch (extension) {

        case '.bz2': {
            await decompress(zipFilePath, tmpDirectory, { plugins: [decompressTarbz()] });
            break;
        }

        case '.gz': {
            await decompress(zipFilePath, tmpDirectory, { plugins: [decompressTargz()] });
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

            const unzippedFiles = await decompress(zipFilePath, tmpDirectory, unzipOptions);
            if (unzippedFiles.length === 0) {
                throw new Error('Zip file does not contain uhk-firmware-*.tar.gz file.');
            }

            return saveTmpFirmware({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: unzippedFiles[0].data as any,
                filename: path.basename(unzippedFiles[0].path),
                saveInHistory: fileData.saveInHistory,
            })
        }

        default:
            throw new Error(`Unsupported firmware file extension: ${extension}`);
    }

    return {
        tmpDirectory,
        packageJsonPath: path.join(tmpDirectory, 'package.json')
    };
}
