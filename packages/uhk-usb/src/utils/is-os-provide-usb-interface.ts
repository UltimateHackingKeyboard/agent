import {platform, release} from 'os';
import semver from 'semver';

let value: boolean | null = null;

/**
 * From macOS 13.3 (Darwin Kernel Version 22.4.0) the interface property of USB device is not provided by the OS.
 */
export default function isOsProvideUsbInterface(): boolean {
    if (value !== null) {
        return value;
    }

    value = platform() !== 'darwin' ||
        (platform() === 'darwin' && semver.lt(release(), '22.4.0'));

    return value;
}
