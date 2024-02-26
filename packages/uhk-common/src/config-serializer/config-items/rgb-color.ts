import { RgbColorInterface } from '../../models/rgb-color-interface.js';

import { assertUInt8 } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';

export class RgbColor {
    @assertUInt8 b: number;
    @assertUInt8 g: number;
    @assertUInt8 r: number;

    constructor(rgbColor?: RgbColor | RgbColorInterface) {
        if (!rgbColor) {
            return;
        }

        this.b = rgbColor.b;
        this.g = rgbColor.g;
        this.r = rgbColor.r;
    }

    public getName(): string {
        return 'RgbColor';
    }

    fromJsonObject(jsonObject: any, version: number): RgbColor {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return this;

            case 6:
            case 7:
                this.fromJsonV6(jsonObject);
                break;

            default:
                throw new Error(`RgbColor does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, version: number): RgbColor {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return this;

            case 6:
            case 7:
                this.fromBinaryV6(buffer);
                break;

            default:
                throw new Error(`RgbColor does not support version: ${version}`);
        }

        return this;
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.r);
        buffer.writeUInt8(this.g);
        buffer.writeUInt8(this.b);
    }

    toJsonObject(): RgbColorInterface {
        return {
            b: this.b,
            g: this.g,
            r: this.r
        };
    }

    private fromBinaryV6(buffer: UhkBuffer): void {
        this.r = buffer.readUInt8();
        this.g = buffer.readUInt8();
        this.b = buffer.readUInt8();
    }

    private fromJsonV6(jsonObject: any): void {
        this.b = jsonObject.b;
        this.g = jsonObject.g;
        this.r = jsonObject.r;
    }
}
