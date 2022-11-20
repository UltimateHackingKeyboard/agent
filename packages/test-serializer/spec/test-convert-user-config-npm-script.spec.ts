import * as desm from 'desm';
import { spawnSync } from 'child_process';
import { remove, ensureDir, pathExists } from 'fs-extra';
import path from 'path';

describe('convert-user-config-to-bin npm script', () => {
    let rootDirPath;
    let tmpDirPath;
    let tmpConfigPath;

    beforeAll(async () => {
        rootDirPath = desm.join(import.meta.url, '..', '..', '..');
        tmpDirPath = desm.join(import.meta.url, '..', 'tmp');
        tmpConfigPath = path.join(tmpDirPath, 'test-config.bin');

        await ensureDir(tmpDirPath);
    });

    afterAll(async () => {
        await remove(tmpDirPath);
    });

    it('should work', async () => {
        const response = spawnSync(
            'npm',
            ['run', 'convert-user-config-to-bin', '--', tmpConfigPath],
            { shell: true, cwd: rootDirPath}
        );

        expect(response.error).toEqual(undefined);
        expect(await pathExists(tmpConfigPath)).toEqual(true);
    });
});
