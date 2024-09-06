#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { BootloaderVersion, KBoot, UsbPeripheral } from 'kboot';
import { EnumerationModes, getCurrentUhkDeviceProduct, snooze, waitForDevice } from 'uhk-usb';

import Uhk, {
    errorHandler,
    getI2cAddressArgs,
    getI2cAddressFromArg,
    yargs
} from './src/index.js';

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
        const reenumerateResult = await device.reenumerate({
            device: uhkDeviceProduct,
            enumerationMode: EnumerationModes.Buspal,
        });
        device.close();
        await waitForDevice(reenumerateResult.vidPidPair.vid, reenumerateResult.vidPidPair.pid);
        const usbPeripheral = new UsbPeripheral({ productId: reenumerateResult.vidPidPair.pid, vendorId: reenumerateResult.vidPidPair.vid });
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
            device: uhkDeviceProduct,
            enumerationMode: EnumerationModes.NormalKeyboard,
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
