import debug from 'debug';
import { devicesAsync, HIDAsync } from 'node-hid';
import { pack } from 'byte-data';

import { Peripheral } from './peripheral.js';
import { CommandOption, CommandResponse, DataOption, USB } from './models/index.js';
import {
    convertLittleEndianNumber,
    convertToHexString,
    deviceFinder,
    encodeCommandOption,
    decodeCommandResponse,
    snooze,
    validateCommandParams
} from './util/index.js';
import { Commands, ResponseTags } from './enums/index.js';

const logger = debug('kboot:usb');
const WRITE_DATA_STREAM_PACKAGE_LENGTH = 32;

export class UsbPeripheral implements Peripheral {
    private _device: HIDAsync;

    constructor(private options: USB) {
        logger('constructor options: %o', options);
    }

    async open(): Promise<void> {
        if (this._device) {
            return;
        }

        logger('Available devices');
        const device = (await devicesAsync())
            .map(x => {
                logger('%o', x);

                return x;
            })
            .find(deviceFinder(this.options));

        if (!device) {
            logger('USB device can not be found %o', this.options);
            throw new Error('USB device can not be found');
        }

        this._device = await HIDAsync.open(device.path);
    }

    async close(): Promise<void> {
        if (this._device) {
            await this._device.close();
            this._device = undefined;
        }
    }

    async sendCommand(options: CommandOption): Promise<CommandResponse> {
        try {
            await this.open();
            validateCommandParams(options.params);
            const data = encodeCommandOption(options);
            logger('send data %o', `<${convertToHexString(data)}>`);
            await this._device.write(data);
            const receivedData = await this._device.read(options.timeout || 2000);
            logger('received data %o', `<${convertToHexString(receivedData)}>`);
            const commandResponse = decodeCommandResponse(receivedData);
            logger('command response: %o', commandResponse);
            return commandResponse;
        } catch (err) {
            logger('USB send command communication error %O', err);

            throw err;
        }
    }

    async writeMemory(option: DataOption): Promise<void> {
        try {
            option.onProgress?.(0);

            const command: CommandOption = {
                command: Commands.WriteMemory,
                hasDataPhase: true,
                params: [
                    ...pack(option.startAddress, { bits: 32 }),
                    ...pack(option.data.length, { bits: 32 })
                ]
            };

            const firsCommandResponse = await this.sendCommand(command);
            if (firsCommandResponse.tag !== ResponseTags.Generic) {
                logger('Invalid write memory response! %o', firsCommandResponse);
                throw new Error('Invalid write memory response!');
            }

            if (firsCommandResponse.code !== 0) {
                logger('Non zero write memory response! %o', firsCommandResponse);
                throw new Error(`Non zero write memory response! Response code: ${firsCommandResponse.code}`);
            }

            for (let i = 0; i < option.data.length; i = i + WRITE_DATA_STREAM_PACKAGE_LENGTH) {
                const slice = option.data.slice(i, i + WRITE_DATA_STREAM_PACKAGE_LENGTH);

                const writeData = [
                    2, // USB channel
                    0,
                    slice.length,
                    0, // TODO: What is it?
                    ...slice
                ];

                logger('send data %o', convertToHexString(writeData));
                await this._device.write(writeData);
                // workaround to prevent main thread blocking
                await snooze(1);
                option.onProgress?.(Math.min(100, Math.round((i + slice.length) / option.data.length * 100)));
            }

            const receivedData = await this._device.read(option.timeout || 2000);
            logger('write memory received data %o', `<${convertToHexString(receivedData)}>`);
            const secondCommandResponse = decodeCommandResponse(receivedData);
            logger('write memory response: %o', secondCommandResponse);

            if (secondCommandResponse.tag !== ResponseTags.Generic) {
                logger('Invalid write memory final response %o', secondCommandResponse);
                throw new Error('Invalid write memory final response!');
            }

            if (secondCommandResponse.code !== 0) {
                logger('Non zero write memory final response %o', secondCommandResponse);
                const msg = `Non zero write memory final response! Response code: ${secondCommandResponse.code}`;
                throw new Error(msg);
            }

            option.onProgress?.(100);
        } catch (err) {
            logger('Can not write memory data %O', err);
            throw err;
        }
    }

    async readMemory(startAddress: number, count: number): Promise<Buffer> {
        try {
            const command: CommandOption = {
                command: Commands.ReadMemory,
                params: [
                    ...pack(startAddress, { bits: 32 }),
                    ...pack(count, { bits: 32 })
                ]
            };

            const firsCommandResponse = await this.sendCommand(command);
            if (firsCommandResponse.tag !== ResponseTags.ReadMemory) {
                logger('Invalid read memory response %o', firsCommandResponse);
                throw new Error('Invalid read memory response!');
            }

            if (firsCommandResponse.code !== 0) {
                logger('Non zero read memory response %o', firsCommandResponse);
                throw new Error(`Non zero read memory response! Response code: ${firsCommandResponse.code}`);
            }

            const byte4Number = firsCommandResponse.raw.slice(12, 15);
            const arrivingDataSize = convertLittleEndianNumber(byte4Number);
            const memoryData: Array<number> = [];
            while (memoryData.length < arrivingDataSize) {
                const receivedData = await this._device.read(2000);
                logger('received data %o', `<${convertToHexString(receivedData)}>`);
                memoryData.push(...receivedData);
                // workaround to prevent main thread blocking
                await snooze(1);
            }

            const responseData = await this._device.read(2000);
            logger('received data %o', `<${convertToHexString(responseData)}>`);

            const secondCommandResponse = decodeCommandResponse(responseData);
            if (secondCommandResponse.tag !== ResponseTags.Generic) {
                logger('Invalid read memory final response %o', secondCommandResponse);
                throw new Error('Invalid read memory final response!');
            }

            if (secondCommandResponse.code !== 0) {
                logger('Non zero read memory final response %o', secondCommandResponse);
                const msg = `Non zero read memory final response! Response code: ${secondCommandResponse.code}`;
                throw new Error(msg);
            }

            return Buffer.from(memoryData);
        } catch (error) {
            logger('Read memory error %O', error);

            throw error;
        }
    }
}
