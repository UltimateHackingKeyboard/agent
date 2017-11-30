import { assertUInt8 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';

export class ModuleConfiguration {

    /*
     * module id enumeration is a separate story
     */

    @assertUInt8
    id: number;

    @assertUInt8
    deceleratedPointerSpeedMultiplier: number;

    @assertUInt8
    basePointerSpeedMultiplier: number;

    @assertUInt8
    acceleratedPointerSpeedMultiplier: number;

    fromJsonObject(jsonObject: any): ModuleConfiguration {
        this.id = jsonObject.id;
        this.deceleratedPointerSpeedMultiplier = jsonObject.deceleratedPointerSpeedMultiplier;
        this.basePointerSpeedMultiplier = jsonObject.basePointerSpeedMultiplier;
        this.acceleratedPointerSpeedMultiplier = jsonObject.acceleratedPointerSpeedMultiplier;
        return this;
    }

    fromBinary(buffer: UhkBuffer): ModuleConfiguration {
        this.id = buffer.readUInt8();
        this.deceleratedPointerSpeedMultiplier = buffer.readUInt8();
        this.basePointerSpeedMultiplier = buffer.readUInt8();
        this.acceleratedPointerSpeedMultiplier = buffer.readUInt8();
        return this;
    }

    toJsonObject(): any {
        return {
            id: this.id,
            deceleratedPointerSpeedMultiplier: this.deceleratedPointerSpeedMultiplier,
            basePointerSpeedMultiplier: this.basePointerSpeedMultiplier,
            acceleratedPointerSpeedMultiplier: this.acceleratedPointerSpeedMultiplier
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.deceleratedPointerSpeedMultiplier);
        buffer.writeUInt8(this.basePointerSpeedMultiplier);
        buffer.writeUInt8(this.acceleratedPointerSpeedMultiplier);
    }

    toString(): string {
        return `<ModuleConfiguration id="${this.id}" >`;
    }
}
