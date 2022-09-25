import * as desm from 'desm';
import * as fs from 'fs-extra';
import * as path from 'path';
import { readdir, stat as statPromise } from 'fs/promises';

import { downloadSmartMacroDoc } from './download-smart-macro-doc.js';

describe('downloadSmartMacroDoc', () => {
    it('should download the doc directory', async () => {
        const directory = desm.join(import.meta.url, '..', 'tmp', 'doc');
        await fs.remove(directory);

        await downloadSmartMacroDoc({
            owner: 'UltimateHackingKeyboard',
            repo: 'firmware',
            commitSha: '885a92a0d6b730fcb74ac7fd7c256d10ab215750',
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

        expect(nrOfFilesInDownloadDir).toEqual(13);
    }, 30000);
});
