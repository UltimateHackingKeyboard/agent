export function generateDeviceSerialNumber(): number {
    return  Math.floor(2 ** 32 * Math.random());
}
