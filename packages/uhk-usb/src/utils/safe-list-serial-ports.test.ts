import { PortInfo } from '@serialport/bindings-interface';
import { describe, it, mock } from 'node:test';
import { SerialPort } from 'serialport';
import { LogService } from 'uhk-common';

import { safeListSerialPorts, Sysfs } from './safe-list-serial-ports.js';

const USB_DEVICE_PATH = '/sys/devices/pci0000:00/usb5/5-1/5-1.2';

const sysfs: Sysfs = {
    readdir: async (path: string) => {
        if (path === '/sys/class/tty') {
            return ['ttyACM0', 'ttyUSB0', 'ttyS0'];
        }

        throw new Error(`ENOENT: ${path}`);
    },
    readFile: async (path: string) => {
        const files: Record<string, string> = {
            [`${USB_DEVICE_PATH}/5-1.2.2/idVendor`]: '37a8',
            [`${USB_DEVICE_PATH}/5-1.2.2/idProduct`]: '0008',
            [`${USB_DEVICE_PATH}/5-1.2.2/serial`]: '1234567890',
            [`${USB_DEVICE_PATH}/5-1.2.2/manufacturer`]: 'Ultimate Gadget Laboratories',
            [`${USB_DEVICE_PATH}/5-1.2.1/idVendor`]: '067b',
            [`${USB_DEVICE_PATH}/5-1.2.1/idProduct`]: '23a3',
        };

        const content = files[path];

        if (content === undefined) {
            throw new Error(`ENOENT: ${path}`);
        }

        return content;
    },
    realpath: async (path: string) => {
        const paths: Record<string, string> = {
            '/sys/class/tty/ttyACM0/device': `${USB_DEVICE_PATH}/5-1.2.2/5-1.2.2:1.0`,
            '/sys/class/tty/ttyUSB0/device': `${USB_DEVICE_PATH}/5-1.2.1/5-1.2.1:1.0/ttyUSB0`,
        };

        const realPath = paths[path];

        if (realPath === undefined) {
            throw new Error(`ENOENT: ${path}`);
        }

        return realPath;
    },
};

describe('safeListSerialPorts', () => {
    it('should fall back to sysfs when SerialPort.list fails', async ({assert}) => {
        const listMock = mock.method(SerialPort, 'list', async () => {
            throw new Error('spawn udevadm ENOENT');
        });

        const logService = {
            misc: () => undefined,
        } as unknown as LogService;

        try {
            const ports: PortInfo[] = await safeListSerialPorts(logService, sysfs);

            assert.deepEqual(ports, [
                {
                    path: '/dev/ttyACM0',
                    vendorId: '37a8',
                    productId: '0008',
                    serialNumber: '1234567890',
                    manufacturer: 'Ultimate Gadget Laboratories',
                    pnpId: undefined,
                    locationId: undefined,
                },
                {
                    path: '/dev/ttyUSB0',
                    vendorId: '067b',
                    productId: '23a3',
                    serialNumber: undefined,
                    manufacturer: undefined,
                    pnpId: undefined,
                    locationId: undefined,
                },
            ]);
        } finally {
            listMock.mock.restore();
        }
    });
});
