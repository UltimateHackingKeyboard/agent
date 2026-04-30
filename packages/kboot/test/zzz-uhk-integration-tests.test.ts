import { afterEach, beforeEach, describe, it } from 'node:test';

import { reenumerate, UhkReenumerationModes, readBootloaderFirmwareFromHexFile } from './uhk-helpers/index.js';
import { BootloaderVersion,  DataOption, KBoot, UsbPeripheral } from '../src/index.js';

describe.skip('UHK Integration tests', () => {
    describe('bootloader', () => {
        let usb: UsbPeripheral;
        let kboot: KBoot;
        beforeEach(() => {
            reenumerate(UhkReenumerationModes.Bootloader);
            usb = new UsbPeripheral({ vendorId: 0x1d50, productId: 0x6120 });
            kboot = new KBoot(usb);
        });

        afterEach(async () => {
            if (usb) {
                await usb.close();
            }

            if (kboot) {
                await kboot.close();
            }
        });

        it('get bootloader version', async ({ assert }) => {
            const expectedVersion: BootloaderVersion = {
                protocolName: 'K',
                major: 2,
                minor: 0,
                bugfix: 0
            };
            const version = await kboot.getBootloaderVersion();

            assert.deepStrictEqual(version, expectedVersion);
        });

        it('disable flash security', ({ assert }) => {
            const backdoorKey = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];

            return kboot
                .flashSecurityDisable(backdoorKey)
                .catch(err => {
                    assert.nok(err);
                });
        });

        it('flash erase region', ({ assert }) => {
            return kboot
                .flashEraseRegion(0xc000, 475136)
                .catch(err => {
                    assert.nok(err);
                });
        });

        it('read memory', ({ assert }) => {
            const dataLength = 128;
            return kboot
                .readMemory(0xc000, dataLength)
                .then((data: Buffer) => {
                    assert.ok(data);
                    assert.strictEqual(data.length, dataLength);
                })
                .catch(err => {
                    assert.nok(err);
                });
        });

        it('write memory', async () => {
            const bootloaderMemoryMap = readBootloaderFirmwareFromHexFile();
            for (const [startAddress, data] of bootloaderMemoryMap.entries()) {
                const dataOption: DataOption = {
                    startAddress,
                    data
                };

                await kboot.writeMemory(dataOption);
            }
        });
    });
});
