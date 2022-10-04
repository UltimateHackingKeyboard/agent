import { FindTreeShaFromTreeOptions } from './find-tree-sha-from-tree-options.js';

export class CannotFindDirError extends Error {
    constructor(public options: FindTreeShaFromTreeOptions) {
        super(`Cannot find "${options.dir}" in the firmware repository`);
    }
}
