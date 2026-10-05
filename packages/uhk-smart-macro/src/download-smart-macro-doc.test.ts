import * as path from 'path';
import { readdir, rm, stat as statPromise } from 'fs/promises';
import { describe, it } from 'node:test';

import { downloadSmartMacroDoc } from './download-smart-macro-doc.js';

describe('downloadSmartMacroDoc', () => {
    it('should download the doc directory', { timeout: 30000 }, async ({ assert }) => {
        const directory = path.join(import.meta.dirname, '..', 'tmp', 'doc');
        await rm(directory, { recursive: true, force: true });

        await downloadSmartMacroDoc({
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

        assert.strictEqual(nrOfFilesInDownloadDir, 13);
    });
});
