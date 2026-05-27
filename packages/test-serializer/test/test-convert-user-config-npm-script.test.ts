import { spawnSync } from 'node:child_process';
import { rmSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

describe('convert-user-config-to-bin npm script', () => {
    let rootDirPath;
    let tmpDirPath;
    let tmpConfigPath;

    before(() => {
        rootDirPath = path.join(import.meta.dirname, '..', '..', '..');
        tmpDirPath = path.join(import.meta.dirname, '..', 'tmp');
        tmpConfigPath = path.join(tmpDirPath, 'test-config.bin');

        mkdirSync(tmpDirPath, { recursive: true });
    });

    after(() => {
        rmSync(tmpDirPath, { recursive: true, force: true });
    });

    it('should work with uhk60', async ({ assert }) => {
        const response = spawnSync(
            'npm',
            ['run', 'convert-user-config-to-bin', '--', 'uhk60', tmpConfigPath],
            { shell: true, cwd: rootDirPath}
        );

        assert.strictEqual(response.error, undefined);
        assert.strictEqual(existsSync(tmpConfigPath), true);
    });

    it('should work with uhk80', async ({ assert }) => {
        const response = spawnSync(
            'npm',
            ['run', 'convert-user-config-to-bin', '--', 'uhk80', tmpConfigPath],
            { shell: true, cwd: rootDirPath}
        );

        assert.strictEqual(response.error, undefined);
        assert.strictEqual(existsSync(tmpConfigPath), true);
    });
});
