import { assertUInt8, assertUInt32 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';

export class HardwareConfiguration {

    signature: string;

    @assertUInt8
    dataModelVersion: number;

    @assertUInt8
    hardwareId: number;

    @assertUInt8
    brandId: number;

    @assertUInt32
    uuid: number;

    isIso: boolean;

    hasBacklighting: boolean;

    fromJsonObject(jsonObject: any): HardwareConfiguration {
        this.signature = jsonObject.signature;
        this.dataModelVersion = jsonObject.dataModelVersion;
        this.hardwareId = jsonObject.hardwareId;
        this.brandId = jsonObject.brandId;
        this.uuid = jsonObject.uuid;
        this.isIso = jsonObject.isIso;
        this.hasBacklighting = jsonObject.hasBacklighting;
        return this;
    }

    fromBinary(buffer: UhkBuffer): HardwareConfiguration {
        this.signature = buffer.readString();
        this.dataModelVersion = buffer.readUInt16();
        this.hardwareId = buffer.readUInt8();
        this.uuid = buffer.readUInt32();
        this.brandId = buffer.readUInt8();
        this.isIso = buffer.readBoolean();
        this.hasBacklighting = buffer.readBoolean();
        return this;
    }

    toJsonObject(): any {
        return {
            signature: this.signature,
            dataModelVersion: this.dataModelVersion,
            hardwareId: this.hardwareId,
            brandId: this.brandId,
            uuid: this.uuid,
            isIso: this.isIso,
            hasBacklighting: this.hasBacklighting
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeString(this.signature);
        buffer.writeUInt16(this.dataModelVersion);
        buffer.writeUInt8(this.hardwareId);
        buffer.writeUInt8(this.brandId);
        buffer.writeUInt32(this.uuid);
        buffer.writeBoolean(this.isIso);
        buffer.writeBoolean(this.hasBacklighting);
    }

    toString(): string {
        return `<HardwareConfiguration signature="${this.signature}">`;
    }

}
