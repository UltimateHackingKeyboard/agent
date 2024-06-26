import { readFile } from 'node:fs/promises';

export async function getUserConfigFromHistoryAsync(filename: string): Promise<Array<number>> {
    const buffer = await readFile(filename);

    return [...buffer];
}
