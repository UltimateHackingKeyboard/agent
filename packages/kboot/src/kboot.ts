import { debug } from 'debug';
import { pack } from 'byte-data';

import { Peripheral } from './peripheral';
import { Commands, MemoryIds, Properties, ResponseCodes, ResponseTags } from './enums';
import { BootloaderVersion, CommandOption, CommandResponse, DataOption } from './models';

const logger = debug('kboot');
const RESET_IGNORED_ERRORS = [
    'could not read data from device',
    'could not read from HID device',
    'Cannot write to HID device',
    'Cannot write to hid device'
];

export class KBoot {
    constructor(private peripheral: Peripheral) {
    }

    open(): void {
        logger('Open peripheral');
        this.peripheral.open();
    }

    close(): void {
        logger('Close peripheral');
        this.peripheral.close();
    }

    // ================= Read properties ==================
    async getProperty(property: Properties, memoryId = MemoryIds.Internal): Promise<CommandResponse> {
        logger('Start read memory %o', { property, memoryId });

        const command: CommandOption = {
            command: Commands.GetProperty,
            params: [
                ...pack(property, { bits: 32 }),
                ...pack(memoryId, { bits: 32 })
            ]
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Property) {
            logger('Response tag is not property response: %d', property);
            throw new Error('Response tag is not property response');
        }

        if (response.code === ResponseCodes.UnknownProperty) {
            logger('Unknown property %d', response.code);
            throw new Error('Unknown property!');
        }

        if (response.code !== ResponseCodes.Success) {
            logger('Unknown error %d', response.code);
            throw new Error(`Unknown error. Error code:${response.code}`);
        }

        return response;
    }

    async getBootloaderVersion(): Promise<BootloaderVersion> {
        logger('Start to read Bootloader Version');

        const response = await this.getProperty(Properties.BootloaderVersion);

        const version: BootloaderVersion = {
            bugfix: response.raw[12],
            minor: response.raw[13],
            major: response.raw[14],
            protocolName: String.fromCharCode(response.raw[15])
        };
        logger('bootloader version %o');

        return version;
    }

    // TODO: Implement other get/set property wrappers
    // ================= End read properties ==================

    async flashSecurityDisable(key: number[]): Promise<void> {
        logger('Start flash security disable %o', { key });
        if (key.length !== 8) {
            logger('Error: Flash security key must be 8 byte. %o', key);
            throw new Error('Flash security key must be 8 byte');
        }

        const command: CommandOption = {
            command: Commands.FlashSecurityDisable,
            params: [...key]
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            logger('Response tag is not generic response: %d', response.tag);
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            logger('Can not disable flash security: %d', response.code);
            throw new Error(`Can not disable flash security`);
        }
    }

    async flashEraseRegion(startAddress: number, count: number): Promise<void> {
        logger('Start flash erase region');
        const command: CommandOption = {
            command: Commands.FlashEraseRegion,
            params: [
                ...pack(startAddress, { bits: 32 }),
                ...pack(count, { bits: 32 })
            ]
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            logger('Response tag is not generic response: %d', response.tag);
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            logger('Can not flash erase region: %d', response.code);
            throw new Error(`Can not flash erase region`);
        }
    }

    async flashEraseAllUnsecure(): Promise<void> {
        logger('Start flash erase all unsecure');
        const command: CommandOption = {
            command: Commands.FlashEraseAllUnsecure,
            params: []
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            logger('Response tag is not generic response: %d', response.tag);
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            logger('Can not flash erase all unsecure: %d', response.code);
            throw new Error(`Can not flash erase all unsecure`);
        }
    }

    async readMemory(startAddress: number, count: number): Promise<Buffer> {
        logger('Start read memory %o', { startAddress, count });
        return this.peripheral.readMemory(startAddress, count);
    }

    async writeMemory(options: DataOption): Promise<void> {
        logger('Start write memory %o', { options });
        return this.peripheral.writeMemory(options);
    }

    /**
     * Reset the bootloader
     */
    async reset(): Promise<void> {
        logger('Start reset the bootloader');
        const command: CommandOption = {
            command: Commands.Reset,
            params: []
        };

        let response: CommandResponse;
        try {
            response = await this.peripheral.sendCommand(command);
        } catch (error) {
            logger(`Reset command error message: "${error.message}"`);

            if (RESET_IGNORED_ERRORS.includes(error.message)) {
                logger('Ignoring missing response from reset command.');

                this.close();

                return;
            }

            throw error;
        }

        if (response.tag !== ResponseTags.Generic) {
            logger('Response tag is not generic response: %d', response.tag);
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            logger('Unknown error %d', response.code);
            throw new Error(`Unknown error. Error code:${response.code}`);
        }
    }

    /**
     * Call it before send data to I2C
     * @param address - The address of the I2C
     * @param [speed=64] - Speed of the I2C
     */
    async configureI2c(address: number, speed = 64): Promise<void> {
        logger('Start configure I2C', { address, speed });
        if (address > 127) {
            logger('Only 7-bit i2c address is supported');
            throw new Error('Only 7-bit i2c address is supported');
        }

        const command: CommandOption = {
            command: Commands.ConfigureI2c,
            params: [
                ...pack(address, { bits: 32 }),
                ...pack(speed, { bits: 32 })
            ]
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            logger('Response tag is not generic response: %d', response.tag);
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            logger('Unknown error %d', response.code);
            throw new Error(`Unknown error. Error code:${response.code}`);
        }
    }
}
