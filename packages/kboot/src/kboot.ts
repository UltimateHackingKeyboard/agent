import { debug } from 'debug';
import { pack } from 'byte-data';

import { Peripheral } from './peripheral';
import { Commands, MemoryIds, Properties, ResponseCodes, ResponseTags } from './enums';
import { BootloaderVersion, CommandOption, CommandResponse, DataOption } from './models';

const logger = debug('kboot');

export class KBoot {
    constructor(private peripheral: Peripheral) {}

    open(): void {
        this.peripheral.open();
    }

    close(): void {
        this.peripheral.close();
    }

    // ================= Read properties ==================
    async getProperty(property: Properties, memoryId = MemoryIds.Internal): Promise<CommandResponse> {
        const command: CommandOption = {
            command: Commands.GetProperty,
            params: [...pack(property, { bits: 32 }), ...pack(memoryId, { bits: 32 })]
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Property) {
            throw new Error('Response tag is not property response');
        }

        if (response.code === ResponseCodes.UnknownProperty) {
            throw new Error('Unknown property!');
        }

        if (response.code !== ResponseCodes.Success) {
            throw new Error(`Unknown error. Error code:${response.code}`);
        }

        return response;
    }

    async getBootloaderVersion(): Promise<BootloaderVersion> {
        const response = await this.getProperty(Properties.BootloaderVersion);

        const version: BootloaderVersion = {
            bugfix: response.raw[12],
            minor: response.raw[13],
            major: response.raw[14],
            protocolName: String.fromCharCode(response.raw[15]),
        };
        logger('bootloader version %o');

        return version;
    }

    // TODO: Implement other get/set property wrappers
    // ================= End read properties ==================

    async flashSecurityDisable(key: number[]): Promise<void> {
        if (key.length !== 8) {
            throw new Error('Flash security key must be 8 byte');
        }

        const command: CommandOption = {
            command: Commands.FlashSecurityDisable,
            params: [...key],
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            throw new Error(`Can not disable flash security`);
        }
    }

    async flashEraseRegion(startAddress: number, count: number): Promise<void> {
        const command: CommandOption = {
            command: Commands.FlashEraseRegion,
            params: [...pack(startAddress, { bits: 32 }), ...pack(count, { bits: 32 })]
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            throw new Error(`Can not disable flash security`);
        }
    }

    async flashEraseAllUnsecure(): Promise<void> {
        const command: CommandOption = {
            command: Commands.FlashEraseAllUnsecure,
            params: [],
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            throw new Error(`Can not disable flash security`);
        }
    }

    async readMemory(startAddress: number, count: number): Promise<any> {
        return this.peripheral.readMemory(startAddress, count);
    }

    async writeMemory(options: DataOption): Promise<void> {
        return this.peripheral.writeMemory(options);
    }

    /**
     * Reset the bootloader
     */
    async reset(): Promise<void> {
        const command: CommandOption = {
            command: Commands.Reset,
            params: [],
        };

        let response: CommandResponse;
        try {
            response = await this.peripheral.sendCommand(command);
        } catch (error) {
            if (error.message === 'could not read from HID device') {
                logger('Ignoring missing response from reset command.');

                this.close();

                return;
            }

            throw error;
        }

        if (response.tag !== ResponseTags.Generic) {
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            throw new Error(`Unknown error. Error code:${response.code}`);
        }
    }

    /**
     * Call it before send data to I2C
     * @param address - The address of the I2C
     * @param [speed=64] - Speed of the I2C
     */
    async configureI2c(address: number, speed = 64): Promise<void> {
        if (address > 127) {
            throw new Error('Only 7-bit i2c address is supported');
        }

        const command: CommandOption = {
            command: Commands.ConfigureI2c,
            params: [...pack(address, { bits: 32 }), ...pack(speed, { bits: 32 })]
        };

        const response = await this.peripheral.sendCommand(command);

        if (response.tag !== ResponseTags.Generic) {
            throw new Error('Response tag is not generic response');
        }

        if (response.code !== ResponseCodes.Success) {
            throw new Error(`Unknown error. Error code:${response.code}`);
        }
    }
}
