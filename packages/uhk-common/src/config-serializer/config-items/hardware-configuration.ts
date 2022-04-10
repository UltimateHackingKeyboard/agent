import { assertUInt8, assertUInt32 } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';

export class HardwareConfiguration {

    signature: string;

    @assertUInt8 majorVersion: number;

    @assertUInt8 minorVersion: number;

    @assertUInt8 patchVersion: number;

    @assertUInt8 brandId: number;

    @assertUInt8 deviceId: number;

    @assertUInt32 uniqueId: number;

    isVendorModeOn: boolean;

    isIso: boolean;

    fromJsonObject(jsonObject: any): HardwareConfiguration {
        this.signature = jsonObject.signature;
        this.majorVersion = jsonObject.majorVersion;
        this.minorVersion = jsonObject.minorVersion;
        this.patchVersion = jsonObject.patchVersion;
        this.brandId = jsonObject.brandId;
        this.deviceId = jsonObject.deviceId;
        this.uniqueId = jsonObject.uniqueId;
        this.isVendorModeOn = jsonObject.isVendorModeOn;
        this.isIso = jsonObject.isIso;
        return this;
    }

    fromBinary(buffer: UhkBuffer): HardwareConfiguration {
        try {
            this.signature = buffer.readString();
            this.majorVersion = buffer.readUInt8();
            this.minorVersion = buffer.readUInt8();
            this.patchVersion = buffer.readUInt8();
            this.brandId = buffer.readUInt8();
            this.deviceId = buffer.readUInt8();
            this.uniqueId = buffer.readUInt32();
            this.isVendorModeOn = buffer.readBoolean();
            this.isIso = buffer.readBoolean();
            return this;
        } catch (e) {
            throw new Error('Please power cycle your keyboard (Invalid hardware configuration: Index out of bounds)');
        }
    }

    toJsonObject(): any {
        return {
            signature: this.signature,
            majorVersion: this.majorVersion,
            minorVersion: this.minorVersion,
            patchVersion: this.patchVersion,
            brandId: this.brandId,
            deviceId: this.deviceId,
            uniqueId: this.uniqueId,
            isVendorModeOn: this.isVendorModeOn,
            isIso: this.isIso
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeString(this.signature);
        buffer.writeUInt8(this.majorVersion);
        buffer.writeUInt8(this.minorVersion);
        buffer.writeUInt8(this.patchVersion);
        buffer.writeUInt8(this.brandId);
        buffer.writeUInt8(this.deviceId);
        buffer.writeUInt32(this.uniqueId);
        buffer.writeBoolean(this.isVendorModeOn);
        buffer.writeBoolean(this.isIso);
    }

    toString(): string {
        return `<HardwareConfiguration signature="${this.signature}">`;
    }
}
