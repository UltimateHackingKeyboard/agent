import { Buffer } from '../buffer.js';
import md5 from 'md5';

export function createMd5Hash(buffer: Buffer): string {
    return md5(buffer);
}
