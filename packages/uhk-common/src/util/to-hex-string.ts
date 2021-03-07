export function toHexString(value: number): string {
    return '0x' + value.toString(16).toUpperCase();
}
