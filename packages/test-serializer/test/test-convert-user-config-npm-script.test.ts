import { spawnSync } from 'child_process';
import { remove, ensureDir, pathExists } from 'fs-extra';
import { after, before, describe, it } from 'node:test';
import path from 'path';

describe('convert-user-config-to-bin npm script', () => {
    let rootDirPath;
    let tmpDirPath;
    let tmpConfigPath;

    before(async () => {
        rootDirPath = path.join(import.meta.dirname, '..', '..', '..');
        tmpDirPath = path.join(import.meta.dirname, '..', 'tmp');
        tmpConfigPath = path.join(tmpDirPath, 'test-config.bin');

        await ensureDir(tmpDirPath);
    });

    after(async () => {
        await remove(tmpDirPath);
    });

    it('should work with uhk60', async ({ assert }) => {
        const response = spawnSync(
            'npm',
            ['run', 'convert-user-config-to-bin', '--', 'uhk60', tmpConfigPath],
            { shell: true, cwd: rootDirPath}
        );

        assert.strictEqual(response.error, undefined);
        assert.strictEqual(await pathExists(tmpConfigPath), true);
    });

    it('should work with uhk80', async ({ assert }) => {
        const response = spawnSync(
            'npm',
            ['run', 'convert-user-config-to-bin', '--', 'uhk80', tmpConfigPath],
            { shell: true, cwd: rootDirPath}
        );

        assert.strictEqual(response.error, undefined);
        assert.strictEqual(await pathExists(tmpConfigPath), true);
    });
});
