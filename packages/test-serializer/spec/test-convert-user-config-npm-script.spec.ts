import { spawnSync } from 'child_process';
import { remove, ensureDir, pathExists } from 'fs-extra';
import path from 'path';

describe('convert-user-config-to-bin npm script', () => {
    let rootDirPath;
    let tmpDirPath;
    let tmpConfigPath;

    beforeAll(async () => {
        rootDirPath = path.join(import.meta.dirname, '..', '..', '..');
        tmpDirPath = path.join(import.meta.dirname, '..', 'tmp');
        tmpConfigPath = path.join(tmpDirPath, 'test-config.bin');

        await ensureDir(tmpDirPath);
    });

    afterAll(async () => {
        await remove(tmpDirPath);
    });

    it('should work with uhk60', async () => {
        const response = spawnSync(
            'npm',
            ['run', 'convert-user-config-to-bin', '--', 'uhk60', tmpConfigPath],
            { shell: true, cwd: rootDirPath}
        );

        expect(response.error).toEqual(undefined);
        expect(await pathExists(tmpConfigPath)).toEqual(true);
    });

    it('should work with uhk80', async () => {
        const response = spawnSync(
            'npm',
            ['run', 'convert-user-config-to-bin', '--', 'uhk80', tmpConfigPath],
            { shell: true, cwd: rootDirPath}
        );

        expect(response.error).toEqual(undefined);
        expect(await pathExists(tmpConfigPath)).toEqual(true);
    });
});
