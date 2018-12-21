import { debug } from 'debug';
import { devices, HID } from 'node-hid';
import { pack } from 'byte-data';

import { Peripheral } from './peripheral';
import { CommandOption, CommandResponse, DataOption, USB } from './models';
import { convertLittleEndianNumber, convertToHexString, deviceFinder, encodeCommandOption } from './util';
import { decodeCommandResponse } from './util/usb/decode-command-response';
import { validateCommandParams } from './util/usb/encode-command-option';
import { Commands, ResponseTags } from './enums';

const logger = debug('kboot:usb');
const WRITE_DATA_STREAM_PACKAGE_LENGTH = 32;

export class UsbPeripheral implements Peripheral {
    private _device: HID;
    private _responseBuffer: Buffer;
    private _dataBuffer: Buffer;
    private _hidError: any;

    constructor(private options: USB) {
        logger('constructor options: %o', options);
    }

    open(): void {
        this._hidError = undefined;

        if (this._device) {
            return;
        }

        logger('Available devices');
        const device = devices()
            .map(x => {
                logger('%O', x);

                return x;
            })
            .find(deviceFinder(this.options));

        if (!device) {
            throw new Error('USB device can not be found');
        }

        this._responseBuffer = new Buffer(0);
        this._dataBuffer = new Buffer(0);

        this._device = new HID(device.path);
        this._device.on('data', this._usbDataListener.bind(this));
        this._device.on('error', this._usbErrorListener.bind(this));
    }

    close(): void {
        if (this._device) {
            this._device.close();
            this._device = undefined;
        }
    }

    async sendCommand(options: CommandOption): Promise<CommandResponse> {
        validateCommandParams(options.params);
        const data = encodeCommandOption(options);
        this._send(data);

        return this._getNextCommandResponse();
    }

    writeMemory(option: DataOption): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
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
                    return reject(new Error('Invalid write memory response!'));
                }

                if (firsCommandResponse.code !== 0) {
                    return reject(new Error(`Non zero write memory response! Response code: ${firsCommandResponse.code}`));
                }

                for (let i = 0; i < option.data.length; i = i + WRITE_DATA_STREAM_PACKAGE_LENGTH) {
                    if (this._hidError) {
                        logger('Throw USB error %O', this._hidError);

                        return reject(new Error('USB error while write data'));
                    }

                    const slice = option.data.slice(i, i + WRITE_DATA_STREAM_PACKAGE_LENGTH);

                    const writeData = [
                        2, // USB channel
                        0,
                        slice.length,
                        0, // TODO: What is it?
                        ...slice
                    ];

                    logger('send data %o', convertToHexString(writeData));
                    this._device.write(writeData);
                }

                const secondCommandResponse = await this._getNextCommandResponse();
                if (secondCommandResponse.tag !== ResponseTags.Generic) {
                    return reject(new Error('Invalid write memory final response!'));
                }

                if (secondCommandResponse.code !== 0) {
                    const msg = `Non zero write memory final response! Response code: ${secondCommandResponse.code}`;
                    return reject(new Error(msg));
                }

                resolve();
            } catch (err) {
                logger('Can not write memory data %O', err);
                reject(err);
            }

        });
    }

    readMemory(startAddress: number, count: number): Promise<Buffer> {
        return new Promise<Buffer>(async (resolve, reject) => {
            try {
                const command: CommandOption = {
                    command: Commands.ReadMemory,
                    params: [
                        ...pack(startAddress, { bits: 32 }),
                        ...pack(count, { bits: 32 })
                    ]
                };

                this._resetDataBuffer();
                this._resetResponseBuffer();
                const firsCommandResponse = await this.sendCommand(command);
                if (firsCommandResponse.tag !== ResponseTags.ReadMemory) {
                    return reject(new Error('Invalid read memory response!'));
                }

                if (firsCommandResponse.code !== 0) {
                    return reject(new Error(`Non zero read memory response! Response code: ${firsCommandResponse.code}`));
                }

                const byte4Number = firsCommandResponse.raw.slice(12, 15);
                const arrivingData = convertLittleEndianNumber(byte4Number);
                const memoryDataBuffer = await this._readFromDataStream(arrivingData);

                const secondCommandResponse = await this._getNextCommandResponse();
                if (secondCommandResponse.tag !== ResponseTags.Generic) {
                    return reject(new Error('Invalid read memory final response!'));
                }

                if (secondCommandResponse.code !== 0) {
                    const msg = `Non zero read memory final response! Response code: ${secondCommandResponse.code}`;
                    return reject(new Error(msg));
                }

                resolve(memoryDataBuffer);
            } catch (error) {
                logger('Read memory error %O', error);

                reject(error);
            }
        });
    }

    private _send(data: number[]): void {
        this.open();

        logger('send data %o', `<${convertToHexString(data)}>`);
        this._device.write(data);
    }

    private _usbDataListener(data: Buffer): void {
        logger('received data %o', `[${convertToHexString(data)}]`);

        const channel = data[0];

        switch (channel) {
            case 3:
                this._responseBuffer = Buffer.concat([this._responseBuffer, data]);
                break;

            case 4:
                this._dataBuffer = Buffer.concat([this._dataBuffer, data]);
                break;

            default:
                logger('Unknown USB channel %o', channel);
                break;
        }
    }

    private _usbErrorListener(error: any): void {
        logger('USB stream error %O', error);
        this._hidError = error;
    }

    private _readFromCommandStream(byte = 36, timeout = 15000): Promise<Buffer> {
        return this._readFromBuffer('_responseBuffer', byte, timeout);
    }

    private _readFromDataStream(byte = 36, timeout = 15000): Promise<Buffer> {
        return this._readFromBuffer('_dataBuffer', byte, timeout);
    }

    private _readFromBuffer(bufferName: string, byte: number, timeout: number): Promise<Buffer> {
        return new Promise<Buffer>(async (resolve, reject) => {
            const startTime = new Date();
            while (startTime.getTime() + timeout > new Date().getTime()) {

                if (this._hidError) {
                    const err = this._hidError;

                    return reject(err);
                }

                const buffer: Buffer = this[bufferName];
                if (buffer.length >= byte) {
                    const data = buffer.slice(0, byte);

                    if (buffer.length === byte) {
                        this[bufferName] = new Buffer(0);
                    } else {
                        const newDataBuffer = new Buffer(buffer.length - byte);
                        buffer.copy(newDataBuffer, 0, byte);
                        this[bufferName] = newDataBuffer;
                    }

                    logger(`read from ${bufferName}: %O`, convertToHexString(data));

                    return resolve(data);
                }

                await snooze(100);
            }

            reject(new Error('Timeout while try to read from buffer'));
        });
    }

    private _resetDataBuffer(): void {
        this._dataBuffer = new Buffer(0);
    }

    private _resetResponseBuffer(): void {
        this._responseBuffer = new Buffer(0);
    }

    private async _getNextCommandResponse(): Promise<CommandResponse> {
        const response = await this._readFromCommandStream();
        const commandResponse = decodeCommandResponse(response);
        logger('next command response: %o', commandResponse);

        return commandResponse;
    }
}

const snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
