import { readdir, rm, stat as statPromise } from 'fs/promises';
import * as path from 'path';
import { describe, it } from 'node:test';

import { downloadSmartMacroReferenceManual } from './download-smart-macro-reference-manual.js';

describe('downloadSmartMacroReferenceManual', () => {
    it('should download the reference manual', { timeout: 30000 }, async ({ assert }) => {
        const directory = path.join(import.meta.dirname, '..', 'tmp', 'doc', 'doc-dev');
        await rm(directory, { recursive: true, force: true });

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

        assert.strictEqual(nrOfFilesInDownloadDir, 1);
    });
});
