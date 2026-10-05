import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function makeTmpDir() {
    // use a prefix to work properly on different systems
    const prefix = join(tmpdir(), 'uhk-');

    return mkdtemp(prefix);
}
