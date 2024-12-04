/**
 * Convert the byte array to hexadecimal string
 */
export default function convertToHex(arr: Array<any>): String {
    return arr.map(x => x.toString(16).padStart(2, '0')).join(' ');
}
