import { access } from 'node:fs/promises'

/**
 * @param {PathLike} path
 * @returns {Promise<boolean>}
 */
export async function pathExists (path) {
    return access(path).then(() => true).catch(() => false)
}
