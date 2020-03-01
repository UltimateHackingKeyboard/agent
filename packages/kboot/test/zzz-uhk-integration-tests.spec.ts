import { reenumerate, UhkReenumerationModes, readBootloaderFirmwareFromHexFile } from './uhk-helpers';
import { BootloaderVersion, UsbPeripheral } from '../src';
import { KBoot } from '../src/kboot';
import { DataOption } from '../index';

xdescribe('UHK Integration tests', () => {
    describe('bootloader', () => {
        let usb: UsbPeripheral;
        let kboot: KBoot;
        beforeEach(() => {
            reenumerate(UhkReenumerationModes.Bootloader);
            usb = new UsbPeripheral({ vendorId: 0x1d50, productId: 0x6120 });
            kboot = new KBoot(usb);
        });

        afterEach(() => {
            if (usb) {
                usb.close();
            }

            if (kboot) {
                kboot.close();
            }
        });

        it('get bootloader version', async () => {
            const expectedVersion: BootloaderVersion = {
                protocolName: 'K',
                major: 2,
                minor: 0,
                bugfix: 0
            };
            const version = await kboot.getBootloaderVersion();

            expect(version).toEqual(expectedVersion);
        });

        it('disable flash security', () => {
            const backdoorKey = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];

            return kboot
                .flashSecurityDisable(backdoorKey)
                .catch(err => {
                    expect(err).toBeFalsy();
                });
        });

        it('flash erase region', () => {
            return kboot
                .flashEraseRegion(0xc000, 475136)
                .catch(err => {
                    expect(err).toBeFalsy();
                });
        });

        it('read memory', () => {
            const dataLength = 128;
            return kboot
                .readMemory(0xc000, dataLength)
                .then((data: Buffer) => {
                    expect(data).toBeTruthy();
                    expect(data.length).toEqual(dataLength);
                })
                .catch(err => {
                    expect(err).toBeFalsy();
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
