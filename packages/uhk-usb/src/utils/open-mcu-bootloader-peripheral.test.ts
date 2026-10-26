import { PortInfo } from '@serialport/bindings-interface';
import { Peripheral } from '@uhk/mcumgr';
import { describe, it } from 'node:test';
import { LogService, VidPidPair } from 'uhk-common';

import { openMcuBootloaderPeripheral } from './open-mcu-bootloader-peripheral.js';

const BOOTLOADER_VID_PIDS: VidPidPair[] = [{ vid: 0x37a8, pid: 0x0008 }];

const logService = {
    error: () => undefined,
    misc: () => undefined,
} as unknown as LogService;

function serialPort(path: string): PortInfo {
    return {
        path,
        vendorId: '37a8',
        productId: '0008',
    } as PortInfo;
}

interface Failures {
    remaining: number;
}

class FakePeripheral implements Peripheral {
    closeCounter = 0;
    isOpen = false;

    constructor(private readonly failures: Failures) {
    }

    async close(): Promise<void> {
        this.closeCounter++;
        this.isOpen = false;
    }

    async open(): Promise<void> {
        if (this.failures.remaining > 0) {
            this.failures.remaining--;

            throw new Error('Opening COM3: Access denied');
        }

        this.isOpen = true;
    }

    async read(): Promise<Buffer> {
        return Buffer.alloc(0);
    }

    async write(): Promise<void> {
        this.isOpen = true;
    }
}

describe('openMcuBootloaderPeripheral', () => {
    it('should wait until the serial port appears', async ({assert}) => {
        const devices: PortInfo[][] = [[], [serialPort('COM3')]];
        let listCounter = 0;

        const peripheral = await openMcuBootloaderPeripheral({
            bootloaderVidPids: BOOTLOADER_VID_PIDS,
            logService,
            timeout: 1000,
            retryDelay: 1,
            listSerialPorts: async () => devices[Math.min(listCounter++, devices.length - 1)],
            createPeripheral: () => new FakePeripheral({remaining: 0}),
        });

        assert.ok(peripheral);
        assert.equal(listCounter, 2);
    });

    it('should retry when the port can not be opened', async ({assert}) => {
        const failures: Failures = {remaining: 1};
        const peripherals: FakePeripheral[] = [];

        const peripheral = await openMcuBootloaderPeripheral({
            bootloaderVidPids: BOOTLOADER_VID_PIDS,
            logService,
            timeout: 1000,
            retryDelay: 1,
            listSerialPorts: async () => [serialPort('COM3')],
            createPeripheral: () => {
                const newPeripheral = new FakePeripheral(failures);
                peripherals.push(newPeripheral);

                return newPeripheral;
            },
        });

        assert.ok(peripheral);
        assert.equal(peripherals.length, 2);
        assert.equal(peripherals[0].closeCounter, 1);
    });

    it('should open the serial port path of the current attempt', async ({assert}) => {
        const paths = ['COM3', 'COM4'];
        const failures: Failures = {remaining: 1};
        let listCounter = 0;
        const openPaths: string[] = [];

        await openMcuBootloaderPeripheral({
            bootloaderVidPids: BOOTLOADER_VID_PIDS,
            logService,
            timeout: 1000,
            retryDelay: 1,
            listSerialPorts: async () => [serialPort(paths[Math.min(listCounter++, paths.length - 1)])],
            createPeripheral: path => {
                openPaths.push(path);

                return new FakePeripheral(failures);
            },
        });

        assert.deepEqual(openPaths, paths);
    });

    it('should throw an error when the serial port does not appear', async ({assert}) => {
        await assert.rejects(
            () => openMcuBootloaderPeripheral({
                bootloaderVidPids: BOOTLOADER_VID_PIDS,
                logService,
                timeout: 20,
                retryDelay: 1,
                listSerialPorts: async () => [],
                createPeripheral: () => new FakePeripheral({remaining: 0}),
            }),
            /The MCU bootloader serial port did not appear within 20ms/,
        );
    });

    it('should throw the last error when the serial port can not be opened', async ({assert}) => {
        await assert.rejects(
            () => openMcuBootloaderPeripheral({
                bootloaderVidPids: BOOTLOADER_VID_PIDS,
                logService,
                timeout: 20,
                retryDelay: 1,
                listSerialPorts: async () => [serialPort('COM3')],
                createPeripheral: () => new FakePeripheral({remaining: Number.MAX_SAFE_INTEGER}),
            }),
            /Could not open the MCU bootloader serial port within 20ms. Last error: Opening COM3: Access denied/,
        );
    });
});
