export function convertArrayToHexArray(arr: number[]): string[] {
    return arr.map(x => x.toString(16).padStart(2, '0'));
}
