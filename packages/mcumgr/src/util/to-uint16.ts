/**
 * Convert a number to UInt16 big edian encoded array
 */
export default function toUint16(data: number): number[] {
    return [
        data >> 8,
        data & 255,
    ];
}
