import { readdir, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string} dir
 * @returns {Promise<any>}
 */
export async function emptyDir (dir) {
    let items
    try {
        items = await readdir(dir)
    } catch {
        return mkdir(dir, {recursive: true})
    }

    return Promise.all(items.map(item => rm(path.join(dir, item), { recursive: true, force: true })))
}
