import process from 'node:process';
import fs from 'node:fs/promises';

import {
    CommandLineArgs,
    OLED_DISPLAY_HEIGHT,
    OLED_DISPLAY_WIDTH,
    UHK_80_DEVICE,
} from 'uhk-common';
import { getCurrentUhkDeviceProduct } from 'uhk-usb';
import { UhkOperations } from 'uhk-usb';

import { ElectronLogService } from '../services/logger.service';
import { createPNG } from './create-png';

export interface CaptureOledOptions {
    logger: ElectronLogService;
    uhkOperations: UhkOperations;
    commandLineArgs: CommandLineArgs;
}

export async function captureOled(options: CaptureOledOptions): Promise<void> {
    try {
        const device = await getCurrentUhkDeviceProduct(options.commandLineArgs);

        if (!device) {
            options.logger.error('Cannot detect UHK device');
            process.exit(-1);
        }
        else if (device.id !== UHK_80_DEVICE.id) {
            options.logger.error(`${device.name} does not have OLED panel.`);
            process.exit(-1);
        }

        const oledData = await options.uhkOperations.readOled()
        const pixelData = Buffer.alloc(OLED_DISPLAY_WIDTH * OLED_DISPLAY_HEIGHT * 3);

        let pixelIndex = 0;
        for (let i = 0; i <oledData.length; i++) {
            const greyScale = oledData.readUInt8(i)

            pixelData[pixelIndex] = greyScale;     // R
            pixelData[pixelIndex + 1] = greyScale; // G
            pixelData[pixelIndex + 2] = greyScale; // B

            pixelIndex += 3;
        }

        const pngBuffer = createPNG(OLED_DISPLAY_WIDTH, OLED_DISPLAY_HEIGHT, pixelData);
        const outputPath = options.commandLineArgs['capture-oled'];
        await fs.writeFile(outputPath, pngBuffer);
        options.logger.misc(`[captureOled] capturing finished successfully.`);
        process.exit(0);
    }
    catch (error) {
        options.logger.error(error.message);
        process.exit(-1);
    }
}
