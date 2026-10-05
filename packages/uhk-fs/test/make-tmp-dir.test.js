import { it } from 'node:test';

import { makeTmpDir } from '../lib/make-tmp-dir.js';
import {pathExists } from '../lib/path-exists.js';

it('tmp dir should contains uhk- prefix', async ({ assert }) => {
    let tmpDir = await makeTmpDir();

    assert.strictEqual(tmpDir.includes('uhk-'), true);
});

it('tmp dir should exists', async ({ assert }) => {
    const tmpDir = await makeTmpDir();

    assert.strictEqual(await pathExists(tmpDir), true);

});
