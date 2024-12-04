import { convertArrayToHexArray } from './convert-array-to-hex-array.js';

export function convertArrayToHexString(arr: number[]): string {
    return convertArrayToHexArray(arr).join(' ');
}
