import fs from 'fs-extra';
import path from 'path';
import urlJoin from 'url-join';


import { downloadFile } from './download-file.js';
import { DownloadSmartMacroDocOptions } from './download-smart-macro-doc.js';

export const REFERENCE_MANUAL_FILE_NAME = 'reference-manual.md';

export async function downloadSmartMacroReferenceManual(options: DownloadSmartMacroDocOptions): Promise<void> {
    await fs.ensureDir(options.directory);

    const githubRawUrl = urlJoin(
        'https://raw.githubusercontent.com',
        options.owner,
        options.repo,
        options.ref,
        'doc-dev',
        REFERENCE_MANUAL_FILE_NAME
    );

    const filePath = path.join(options.directory, REFERENCE_MANUAL_FILE_NAME);
    await downloadFile(githubRawUrl, filePath);
}
