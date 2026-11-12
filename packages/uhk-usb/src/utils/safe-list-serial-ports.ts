import { readdir, readFile, realpath } from 'node:fs/promises';
import { dirname } from 'node:path';
import { PortInfo } from '@serialport/bindings-interface';
import { SerialPort } from 'serialport';
import { LogService } from 'uhk-common';

const TTY_PREFIXES = ['ttyACM', 'ttyUSB'];
const MAX_USB_DEVICE_LOOKUP_DEPTH = 5;

/**
 * The subset of the sysfs filesystem used to find the USB metadata of a serial port.
 * It can be replaced in tests.
 */
export interface Sysfs {
    readdir: (path: string) => Promise<string[]>;
    readFile: (path: string, encoding: 'utf8') => Promise<string>;
    realpath: (path: string) => Promise<string>;
}

const defaultSysfs: Sysfs = {
    readdir,
    readFile,
    realpath,
};

/**
 * List serial ports, returning an empty list when the platform cannot enumerate them.
 *
 * `SerialPort.list()` shells out to `udevadm`, which is not available inside a Flatpak
 * sandbox. The failure is only a detection/logging limitation — HID devices are still
 * found through `node-hid` — so it must not fail the surrounding device state query.
 *
 * On Linux the fallback reads the device metadata from `/sys/class/tty` instead. The
 * UHK MCU bootloader is a CDC-ACM serial device, so without this fallback the bootloader
 * never appears in the sandbox and the firmware upgrade times out.
 */
let hasLoggedSerialPortListFailure = false;

async function readOptional(sysfs: Sysfs, filePath: string): Promise<string | undefined> {
    try {
        return (await sysfs.readFile(filePath, 'utf8')).trim();
    } catch {
        return undefined;
    }
}

async function findUsbDevicePath(sysfs: Sysfs, devicePath: string): Promise<string | undefined> {
    let currentPath = devicePath;

    for (let depth = 0; depth < MAX_USB_DEVICE_LOOKUP_DEPTH; depth++) {
        const vendorId = await readOptional(sysfs, `${currentPath}/idVendor`);

        if (vendorId) {
            return currentPath;
        }

        const parentPath = dirname(currentPath);

        if (parentPath === currentPath) {
            return undefined;
        }

        currentPath = parentPath;
    }

    return undefined;
}

async function listSerialPortsFromSysfs(sysfs: Sysfs): Promise<PortInfo[] | undefined> {
    let ttyEntries: string[];

    try {
        ttyEntries = await sysfs.readdir('/sys/class/tty');
    } catch {
        return undefined;
    }

    const ports: PortInfo[] = [];

    for (const ttyEntry of ttyEntries) {
        if (!TTY_PREFIXES.some(prefix => ttyEntry.startsWith(prefix))) {
            continue;
        }

        try {
            const devicePath = await sysfs.realpath(`/sys/class/tty/${ttyEntry}/device`);
            const usbDevicePath = await findUsbDevicePath(sysfs, devicePath);

            if (!usbDevicePath) {
                continue;
            }

            const vendorId = await readOptional(sysfs, `${usbDevicePath}/idVendor`);
            const productId = await readOptional(sysfs, `${usbDevicePath}/idProduct`);

            if (!vendorId || !productId) {
                continue;
            }

            ports.push({
                path: `/dev/${ttyEntry}`,
                vendorId,
                productId,
                serialNumber: await readOptional(sysfs, `${usbDevicePath}/serial`),
                manufacturer: await readOptional(sysfs, `${usbDevicePath}/manufacturer`),
                pnpId: undefined,
                locationId: undefined,
            });
        } catch {
            // The tty may disappear between the directory listing and the device read.
        }
    }

    return ports;
}

export async function safeListSerialPorts(
    logService?: LogService,
    sysfs: Sysfs = defaultSysfs,
): Promise<PortInfo[]> {
    try {
        return await SerialPort.list();
    } catch (error) {
        const sysfsPorts = process.platform === 'linux'
            ? await listSerialPortsFromSysfs(sysfs)
            : undefined;

        if (sysfsPorts) {
            if (logService && !hasLoggedSerialPortListFailure) {
                hasLoggedSerialPortListFailure = true;
                logService.misc('[UhkHidDevice] SerialPort.list() failed, using sysfs fallback:', error);
            }

            return sysfsPorts;
        }

        if (logService && !hasLoggedSerialPortListFailure) {
            hasLoggedSerialPortListFailure = true;
            logService.misc('[UhkHidDevice] Cannot list serial devices:', error);
        }

        return [];
    }
}
