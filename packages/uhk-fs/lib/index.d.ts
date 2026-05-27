import { PathLike } from 'node:fs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function emptyDir(dir: string): Promise<any>;
export function pathExists(path: PathLike): Promise<boolean>;
