import debug from 'debug';
import {setTimeout} from 'node:timers/promises';
import {SerialPort} from 'serialport';

import { Peripheral } from './peripheral.js';
import crc16 from './util/crc16.js';
import toUint16 from './util/to-uint16.js';
import convertToHex from './util/convert-to-hex.js';
import fromUint16 from "./util/from-uint16.js";

// The 1st byte of the first message packet of the message
const FIRST_MSG_PACKET_1 = 6;
// The 2nd byte of the first message packet of the message
const FIRST_MSG_PACKET_2 = 9;
// The 1st byte of the non first message packet of the message
const OTHER_MSG_PACKET_1 = 4;
// The 2nd byte of the non first message packet of the message
const OTHER_MSG_PACKET_2 = 20;

const logger = debug('mcumgr:serial');

export class SerialPeripheral implements Peripheral {
    #serialPort: SerialPort;

    constructor(devicePath: string) {
        logger('constructor options: %o', { devicePath });
        this.#serialPort =  new SerialPort({
            path: devicePath,
            baudRate: 115200,
            autoOpen: false,
        });
    }

    async close(): Promise<void> {
        logger('Start closing port');
        if(!this.#serialPort.isOpen) {
            logger('Port already closed');
            return;
        }

        return new Promise((resolve, reject) => {
            logger('Closing port');
            this.#serialPort.close(err => {
                if (err) {
                    logger('Port closing error: %s', err.message);
                    return reject(err);
                }

                logger('Port closed');
                resolve();
            });
        });
    }

    async open(): Promise<void> {
        logger('Start opening port');
        if (this.#serialPort.isOpen) {
            logger('Port already open');
            return;
        }

        return new Promise((resolve, reject) => {
            logger('Opening port');
            this.#serialPort.open(err => {
                if (err) {
                    logger('Error opening port: %s', err.message);
                    return reject(err);
                }

                logger('Port opened');
                resolve();
            });
        });
    }

    async read(timeout: number): Promise<Buffer> {
        logger('Start reading');
        let raw = Buffer.alloc(0);
        const startTime = new Date().getTime();

        while (true) {
            const response = this.#serialPort.read();
            logger('Read response: %o', response);
            let exit = false;

            if (response) {
                for (let i = 0; i < response.length; i++) {
                    const b = response[i];

                    // skip the carriage return
                    if (b === 13)
                        continue;

                    // if the byte is line feed then the full response arrived
                    if (b === 10) {
                        exit = true;
                        break;
                    }

                    raw = Buffer.concat([raw, Buffer.from([b])]);
                }
            }

            if (exit) {
                break;
            }

            logger('Read wait');
            await setTimeout(2);

            if (new Date().getTime() - startTime > timeout) {
                logger('Read timeout');
                throw new Error('Read SerialPort timeout');
            }
        }

        logger("raw response: %s", convertToHex([...raw]));

        // The message packet does not start with the proper header bytes throw an error
        if ((raw[0] !== FIRST_MSG_PACKET_1 || raw[1] !== FIRST_MSG_PACKET_2)
            && (raw[0] !== OTHER_MSG_PACKET_1 || raw[1] !== OTHER_MSG_PACKET_2))
            throw new Error('Invalid serial packet response header'); // TODO: custom error

        const data = raw.subarray(2);
        const bytes = Buffer.from(data.toString(), "base64");
        const messageLength = fromUint16(bytes.subarray(0, 2));
        const crc = fromUint16(bytes.subarray(bytes.length - 2));
        // TODO: validate message length
        const nmpData = bytes.subarray(2, bytes.length - 2);
        const calculatedCrc = crc16(nmpData);

        if (calculatedCrc !== crc) {
            logger('Invalid serial packet CRC. Expected: %d Actual: %d', crc, calculatedCrc);
            throw new Error('Invalid serial packet CRC'); // TODO: custom error
        }

        return nmpData;
    }

    async write(message: Array<number>): Promise<void> {
        logger('Start writing');
        const crc = crc16(message);
        // The length is a 2 byte CRC + length of the message
        const dataLength = 2 + message.length;
        const data = [
            ...toUint16(dataLength),
            ...message,
            ...toUint16(crc),
        ] as Array<number>;

        const base64Encoded = Buffer.from(data).toString('base64');
        logger('Base64 encoded message: ', base64Encoded);
        const totalLength = base64Encoded.length;
        let written = 0;

        while (written < totalLength) {
            // Write the packet stat designators.
            // They are different whether we are starting a new packet or continuing one
            if (written === 0) {
                await this.#_write([FIRST_MSG_PACKET_1, FIRST_MSG_PACKET_2]);
            } else {
                // Slower platforms take some time to process each segment and have very small receive buffers.
                // Give them a bit of time here
                await setTimeout(2);
                await this.#_write([OTHER_MSG_PACKET_1, OTHER_MSG_PACKET_2]);
            }

            // Ensure that the total frame fits into 128 bytes.
            // Base 64 is 3 ascii to 4 base 64 byte encoding, so the number below should be a multiple of 4.
            // We need to save room for the header (2 byte) and carriage return (and possibly LF 2 bytes).
            const writeLen = Math.min(1020, totalLength - written);
            await this.#_write(base64Encoded.slice(written, written + writeLen));
            await this.#_write('\n');

            written += writeLen;
        }
    }

    /**
     * Drain or flush the message from the serial buffer
     */
    async #drain(): Promise<void> {
        logger('Start draining');
        return new Promise((resolve, reject) => {
            this.#serialPort.drain(err => {
                if (err) {
                    logger('Error draining: %s', err.message);
                    return reject(err);
                }

                logger('Drained');
                resolve();
            });
        });
    }

    async #_write(data: any): Promise<void> {
        await this.open();

        logger('Write packet %o', data);
        const drained = this.#serialPort.write(data);

        if (drained)
            return;

        return this.#drain();
    }
}
