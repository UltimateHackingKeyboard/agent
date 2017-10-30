import { Device, devices, HID } from 'node-hid';
import { LogService } from 'uhk-common';

import { Constants, EepromTransfer, UsbCommand } from './constants';

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * HID API wrapper to support unified logging and async write
 */
export class UhkHidDevice {
    /**
     * Convert the Buffer to number[]
     * @param {Buffer} buffer
     * @returns {number[]}
     * @private
     * @static
     */
    public static convertBufferToIntArray(buffer: Buffer): number[] {
        return Array.prototype.slice.call(buffer, 0);
    }

    /**
     * Split the communication package into 64 byte fragments
     * @param {UsbCommand} usbCommand
     * @param {Buffer} configBuffer
     * @returns {Buffer[]}
     * @private
     */
    public static getTransferBuffers(usbCommand: UsbCommand, configBuffer: Buffer): Buffer[] {
        const fragments: Buffer[] = [];
        const MAX_SENDING_PAYLOAD_SIZE = Constants.MAX_PAYLOAD_SIZE - 4;
        for (let offset = 0; offset < configBuffer.length; offset += MAX_SENDING_PAYLOAD_SIZE) {
            const length = offset + MAX_SENDING_PAYLOAD_SIZE < configBuffer.length
                ? MAX_SENDING_PAYLOAD_SIZE
                : configBuffer.length - offset;
            const header = new Buffer([usbCommand, length, offset & 0xFF, offset >> 8]);
            fragments.push(Buffer.concat([header, configBuffer.slice(offset, offset + length)]));
        }

        return fragments;
    }

    /**
     * Create the communication package that will send over USB and
     * - add usb report code as 1st byte
     * - https://github.com/node-hid/node-hid/issues/187 issue
     * @param {Buffer} buffer
     * @returns {number[]}
     * @private
     * @static
     */
    private static getTransferData(buffer: Buffer): number[] {
        const data = UhkHidDevice.convertBufferToIntArray(buffer);
        // if data start with 0 need to add additional leading zero because HID API remove it.
        // https://github.com/node-hid/node-hid/issues/187
        // if (data.length > 0 && data[0] === 0 && process.platform === 'win32') {
        //     data.unshift(0);
        // }

        // From HID API documentation:
        // http://www.signal11.us/oss/hidapi/hidapi/doxygen/html/group__API.html#gad14ea48e440cf5066df87cc6488493af
        // The first byte of data[] must contain the Report ID.
        // For devices which only support a single report, this must be set to 0x0.
        data.unshift(0);

        return data;
    }

    /**
     * Convert buffer to space separated hexadecimal string
     * @param {Buffer} buffer
     * @returns {string}
     * @private
     * @static
     */
    private static bufferToString(buffer: Array<number>): string {
        let str = '';
        for (let i = 0; i < buffer.length; i++) {
            let hex = buffer[i].toString(16) + ' ';
            if (hex.length <= 2) {
                hex = '0' + hex;
            }
            str += hex;
        }
        return str;
    }

    /**
     * Internal variable that represent the USB UHK device
     * @private
     */
    private _device: HID;

    constructor(private logService: LogService) {
    }

    /**
     * Return true if the app has right to communicate over the USB.
     * Need only on linux.
     * If return false need to run {project-root}/rules/setup-rules.sh or
     * the Agent will ask permission to run at the first time.
     * @returns {boolean}
     */
    public hasPermission(): boolean {
        try {
            devices();
            return true;
        } catch (err) {
            this.logService.error('[UhkHidDevice] hasPermission', err);
        }

        return false;
    }

    /**
     * Send data to the UHK device and wait for the response.
     * Throw an error when 1st byte of the response is not 0
     * @param {Buffer} buffer
     * @returns {Promise<Buffer>}
     */
    public async write(buffer: Buffer): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const device = this.getDevice();

            if (!device) {
                return reject(new Error('[UhkHidDevice] Device is not connected'));
            }

            device.read((err: any, receivedData: Array<number>) => {
                if (err) {
                    this.logService.error('[UhkHidDevice] Transfer error: ', err);
                    return reject(err);
                }
                const logString = UhkHidDevice.bufferToString(receivedData);
                this.logService.debug('[UhkHidDevice] USB[R]:', logString);

                if (receivedData[0] !== 0) {
                    return reject(new Error(`Communications error with UHK. Response code: ${receivedData[0]}`));
                }

                return resolve(Buffer.from(receivedData));
            });

            const sendData = UhkHidDevice.getTransferData(buffer);
            this.logService.debug('[UhkHidDevice] USB[W]:', UhkHidDevice.bufferToString(sendData).substr(3));
            device.write(sendData);
        });
    }

    public async writeConfigToEeprom(transferType: EepromTransfer): Promise<void> {
        await this.write(new Buffer([UsbCommand.LaunchEepromTransfer, transferType]));
        await this.waitUntilKeyboardBusy();
    }

    /**
     * Close the communication chanel with UHK Device
     */
    public close(): void {
        if (!this._device) {
            return;
        }

        this._device.close();
        this._device = null;
    }

    public async waitUntilKeyboardBusy(): Promise<void> {
        while (true) {
            const buffer = await this.write(new Buffer([UsbCommand.GetKeyboardState]));
            if (buffer[1] === 0) {
                break;
            }
            this.logService.debug('Keyboard is busy, wait...');
            await snooze(200);
        }
    }

    /**
     * Return the stored version of HID device. If not exist try to initialize.
     * @returns {HID}
     * @private
     */
    private getDevice() {
        if (!this._device) {
            this._device = this.connectToDevice();
        }

        return this._device;
    }

    /**
     * Initialize new UHK HID device.
     * @returns {HID}
     */
    private connectToDevice(): HID {
        try {
            const devs = devices();
            this.logService.debug('[DeviceService] Available devices:', devs);

            const dev = devs.find((x: Device) =>
                x.vendorId === Constants.VENDOR_ID &&
                x.productId === Constants.PRODUCT_ID &&
                ((x.usagePage === 128 && x.usage === 129) || x.interface === 0));

            if (!dev) {
                this.logService.info('[DeviceService] UHK Device not found:');
                return null;
            }
            const device = new HID(dev.path);
            this.logService.info('[DeviceService] Used device:', dev);
            return device;
        }
        catch (err) {
            this.logService.error('[DeviceService] Can not create device:', err);
        }

        return null;
    }

}
