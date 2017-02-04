import { assertUInt8 } from '../assert';
import { UhkBuffer } from '../UhkBuffer';

export class HardwareConfiguration {

    signature: string;

    @assertUInt8
    dataModelVersion: number;

    @assertUInt8
    hardwareId: number;

    @assertUInt8
    brandId: number;

    isIso: boolean;

    hasBacklighting: boolean;

    fromJsonObject(jsonObject: any): HardwareConfiguration {
        this.signature = jsonObject.signature;
        this.dataModelVersion = jsonObject.dataModelVersion;
        this.hardwareId = jsonObject.hardwareId;
        this.brandId = jsonObject.brandId;
        this.isIso = jsonObject.isIso;
        this.hasBacklighting = jsonObject.hasBacklighting;
        return this;
    }

    fromBinary(buffer: UhkBuffer): HardwareConfiguration {
        this.signature = buffer.readString();
        this.dataModelVersion = buffer.readUInt16();
        this.hardwareId = buffer.readUInt8();
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
            isIso: this.isIso,
            hasBacklighting: this.hasBacklighting
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeString(this.signature);
        buffer.writeUInt16(this.dataModelVersion);
        buffer.writeUInt8(this.hardwareId);
        buffer.writeUInt8(this.brandId);
        buffer.writeBoolean(this.isIso);
        buffer.writeBoolean(this.hasBacklighting);
    }

    toString(): string {
        return `<HardwareConfiguration signature="${this.signature}">`;
    }

}
