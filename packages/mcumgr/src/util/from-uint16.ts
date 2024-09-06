/**
 * Create a number from the first 2 bytes of the Array. It uses big edian encoding
 */
export default function fromUint16(arr: ArrayLike<any> | Buffer): number {
    return (arr[0] * 256) + arr[1];
}
