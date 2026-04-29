import fs from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export async function downloadFile(url: string, filePath: string): Promise<void> {
    const res = await fetch(url);

    if (!res.ok)
        throw new Error(`Failed to download smart macro file: ${url} ${res.status} ${res.statusText}`);

    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(filePath));
}
