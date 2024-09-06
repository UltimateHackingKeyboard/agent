import { BinaryLike } from 'crypto';
import debug from 'debug';
import {createHash} from 'node:crypto';

import {
    IMAGE_OPERATION,
    MGMT_GROUP,
    MGMT_OP,
    MGMT_GROUP_TYPE,
    MGMT_OP_TYPE,
    MGMT_OPERATION_TYPE,
    OS_OPERATION,
} from './constants.js';
import { ImageUploadRequest } from './models/image-upload-request.js';
import { ImageUploadResponseData } from './models/image-upload-response-data.js';
import { NmpResponse } from './models/nmp.js';
import { Peripheral } from './peripheral.js';
import * as cbor from './util/cbor.js';
import convertToHex from './util/convert-to-hex.js';
import toUint16 from './util/to-uint16.js';
import fromUint16 from './util/from-uint16.js';

const NMP_HEADER_SIZE = 8;
// Message transfer unit. TODO: maybe it should be exposed by peripheral.
const MTU = 1020;

const logger = debug('mcumgr');

export class McuManager {
    #peripheral: Peripheral;
    #seq: number;

    constructor(peripheral: Peripheral) {
        this.#peripheral = peripheral;
    }

    /**
     * Close the underlying peripheral
     */
    async close(): Promise<void> {
        logger('Close peripheral');
        return this.#peripheral.close();
    }

    /**
     * Send a message to the device that send it back.
     * UHK not implemented this command!
     * TODO: define response type
     */
    async echo(message: string): Promise<void> {
        logger('Start send echo command: "%s"', message);
        await this.sendCommand(MGMT_OP.WRITE, MGMT_GROUP.OS, OS_OPERATION.ECHO, {d: message});
    }

    /**
     * Erase the firmware image.
     * UHK not implemented this command!
     */
    async imageErase(): Promise<void> {
        logger('Start send image erase command');
        await this.sendCommand(MGMT_OP.WRITE, MGMT_GROUP.IMAGE, IMAGE_OPERATION.ERASE, {});
    }

    /**
     * Query images from the device
     * TODO: Implement response structure
     * @returns {Promise<*>}
     */
    async imageReadState():Promise<any> {
        logger('Start send image read state command');
        return this.sendCommand(MGMT_OP.READ, MGMT_GROUP.IMAGE, IMAGE_OPERATION.STATE);
    }

    /**
     * Upload a firmware/bootloader image to the device
     */
    async imageUpload(buffer: Buffer): Promise<void> {
        logger('Start send image upload command: %o', { bufferLength: buffer.byteLength });
        let written = 0;

        while (written < buffer.length) {
            const message: ImageUploadRequest = {
                data: new Uint8Array(),
                off: written
            };

            // set the image length and sha only in the first message packet
            if (written === 0) {
                message.len = buffer.length;
                message.sha = new Uint8Array(this.#sha256(buffer));
            }

            const cborEncoded = cbor.encode(message);
            const length = MTU - NMP_HEADER_SIZE - cborEncoded.byteLength;
            message.data = new Uint8Array(buffer.subarray(written, written + length));

            const response = await this.sendCommand<ImageUploadResponseData>(MGMT_OP.WRITE, MGMT_GROUP.IMAGE, IMAGE_OPERATION.UPLOAD, message);

            written += length;

            // Overwrite the written length with response off that represent how many byte processed by the mcu
            if ((response.data?.rc === 0 || response.data?.rc === undefined) && response.data?.off) {
                written = response.data?.off;
            }

            logger('Image uploaded: %d', written / buffer.length * 100);
        }
    }

    /**
     * Reset/restart the device
     */
    async reset(): Promise<void> {
        logger('Start send reset command');
        await this.sendCommand(MGMT_OP.WRITE, MGMT_GROUP.OS, OS_OPERATION.RESET);
    }

    /**
     * Send command to the microcontroller
     */
    async sendCommand<T>(op: MGMT_OP_TYPE, group: MGMT_GROUP_TYPE, id: MGMT_OPERATION_TYPE, data?: any): Promise<NmpResponse<T>> {
        logger('Start send command: %o', {op, group, id, data});

        let encodedData = [];
        if (typeof data !== 'undefined') {
            // the command data is cbor encoded
            const buffer = cbor.encode(data);
            const a = new Uint8Array(buffer);
            encodedData = [...a];
            logger('Cbor data: %s', convertToHex(encodedData));
        }

        // The firs 8 byte is the header
        const message = [
            op,
            0, // it is the flags field we don't use it
            ...toUint16(encodedData.length),
            ...toUint16(group),
            this.#Seq(), // technically it is a random number that makes the testing complicated
            id,
            ...encodedData,
        ];

        logger('NMP message: %s', convertToHex(message));

        await this.#peripheral.write(message);
        const response = await this.#peripheral.read(15000);
        logger('Nmp raw response %o', response);
        const parsedResponse = this.#parseNmpMessage<T>(response);
        logger("Nmp parsed response %o", parsedResponse);

        return parsedResponse;
    }

    // TODO: maybe move to external function for testability
    #parseNmpMessage<T>(buffer: Buffer): NmpResponse<T> {
        const [op, flags, length_hi, length_lo, group_hi, group_lo, seq, id] = buffer;

        let data: any;

        // the buffer contains data
        // TODO: Maybe worth validate the length of the data section = header.length
        if (buffer.length > NMP_HEADER_SIZE) {
            const dataSlice = buffer.subarray(8);
            data = cbor.decode(dataSlice.buffer.slice(dataSlice.byteOffset, dataSlice.byteOffset + dataSlice.byteLength));
        }

        return {
            op,
            flags,
            length: fromUint16([length_hi, length_lo]),
            group: fromUint16([group_hi, group_lo]),
            seq,
            id,
            data,
        } as any;
    }

    /**
     * Generates the sequence number of the MCU datagram.
     * If the sequence number is undefined then generate a random seed value.
     * With random seed we just try to prevent the conflict with the previous operation
     * The sequence number is an UInt8 data so if the value is greater than 255 then set it to 0
     */
    #Seq(): number {
        if (this.#seq === undefined) {
            this.#seq = Math.floor(Math.random() * 255);
        } else {
            this.#seq++;
            if (this.#seq > 255)
                this.#seq = 0;
        }

        return this.#seq;
    }

    /**
     * Create SHA256 has of the input
     */
    #sha256(data: BinaryLike): Buffer {
        return createHash('sha256').update(data).digest();
    }
}
