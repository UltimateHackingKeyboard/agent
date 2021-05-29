#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import { BootloaderVersion, KBoot, UsbPeripheral } from 'kboot';
import { EnumerationModes, getCurrentUhkDeviceProduct, snooze, waitForDevice } from 'uhk-usb';

import Uhk, {
    errorHandler,
    getI2cAddressArgs,
    getI2cAddressFromArg,
    yargs
} from './src';

(async () => {
    try {
        const argv = yargs
            .scriptName('./get-module-bootloader-version')
            .usage('Usage: $0 <module>')
            .demandCommand(1, `I2C address is required, ${getI2cAddressArgs()}`)
            .argv;

        const i2cAddress = getI2cAddressFromArg(argv._[0] as string);
        const uhkDeviceProduct = getCurrentUhkDeviceProduct();

        const { device, logger } = Uhk(argv);
        await device.reenumerate({
            enumerationMode: EnumerationModes.Buspal,
            vendorId: uhkDeviceProduct.vendorId,
            productId: uhkDeviceProduct.buspalPid
        });
        device.close();
        await waitForDevice(uhkDeviceProduct.vendorId, uhkDeviceProduct.buspalPid);
        const usbPeripheral = new UsbPeripheral({ productId: uhkDeviceProduct.buspalPid, vendorId: uhkDeviceProduct.vendorId });
        let kboot: KBoot;
        let bootloaderVersion: BootloaderVersion;
        const startTime = new Date();

        while (new Date().getTime() - startTime.getTime() < 30000) {
            try {
                logger.misc(`[UhkOperations] Try to connect to the "${i2cAddress}"`);
                kboot = new KBoot(usbPeripheral);
                await kboot.configureI2c(i2cAddress);
                bootloaderVersion = await kboot.getBootloaderVersion();
                break;
            } catch {
                if (kboot) {
                    kboot.close();
                }
                await snooze(200);
            }
        }
        kboot.reset();
        kboot.close();
        await device.reenumerate({
            enumerationMode: EnumerationModes.NormalKeyboard,
            vendorId: uhkDeviceProduct.vendorId,
            productId: uhkDeviceProduct.keyboardPid
        });

        if (bootloaderVersion) {
            console.log('Module bootloader', bootloaderVersion);
        } else {
            console.error('Can not read module bootloader');
        }
    } catch (error) {
        errorHandler(error);
    }
})();
