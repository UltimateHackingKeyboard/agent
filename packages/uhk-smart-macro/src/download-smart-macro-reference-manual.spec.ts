import * as desm from 'desm';
import * as fs from 'fs-extra';
import { stat as statPromise } from 'fs/promises';
import { readdir } from 'fs/promises';
import * as path from 'path';

import { downloadSmartMacroReferenceManual } from './download-smart-macro-reference-manual.js';

describe('downloadSmartMacroReferenceManual', () => {
    it('should download the reference manual', async () => {
        const directory = desm.join(import.meta.url, '..', 'tmp', 'doc', 'doc-dev');
        await fs.remove(directory);

        await downloadSmartMacroReferenceManual({
            owner: 'UltimateHackingKeyboard',
            repo: 'firmware',
            ref: '885a92a',
            directory
        });

        const dirEntries = await readdir(directory);
        let nrOfFilesInDownloadDir = 0;

        for(const fileEntry of dirEntries) {
            const entryPath = path.join(directory, fileEntry);
            const stat = await statPromise(entryPath);

            if(stat.isFile()) {
                nrOfFilesInDownloadDir++;
            }
        }

        expect(nrOfFilesInDownloadDir).toEqual(1);
    }, 30000);
});
