import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

export async function getUdevFileContentAsync(rootDir: string): Promise<string> {
    const filePath = join(rootDir, 'rules/50-uhk60.rules');

    return readFileAsync(filePath, { encoding: 'utf-8' });
}
