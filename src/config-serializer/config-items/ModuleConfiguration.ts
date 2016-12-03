import { assertUInt8 } from '../assert';
import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';

export class ModuleConfiguration extends Serializable<ModuleConfiguration> {

    /*
     * module id enumeration is a separate story
     */

    @assertUInt8
    id: number;

    @assertUInt8
    initialPointerSpeed: number;

    @assertUInt8
    pointerAcceleration: number;

    @assertUInt8
    maxPointerSpeed: number;

    fromJsonObject(jsonObject: any): ModuleConfiguration {
        this.id = jsonObject.id;
        this.initialPointerSpeed = jsonObject.initialPointerSpeed;
        this.pointerAcceleration = jsonObject.pointerAcceleration;
        this.maxPointerSpeed = jsonObject.maxPointerSpeed;
        return this;
    }

    fromBinary(buffer: UhkBuffer): ModuleConfiguration {
        this.id = buffer.readUInt8();
        this.initialPointerSpeed = buffer.readUInt8();
        this.pointerAcceleration = buffer.readUInt8();
        this.maxPointerSpeed = buffer.readUInt8();
        return this;
    }

    _toJsonObject(): any {
        return {
            id: this.id,
            initialPointerSpeed: this.initialPointerSpeed,
            pointerAcceleration: this.pointerAcceleration,
            maxPointerSpeed: this.maxPointerSpeed
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.initialPointerSpeed);
        buffer.writeUInt8(this.pointerAcceleration);
        buffer.writeUInt8(this.maxPointerSpeed);
    }

    toString(): string {
        return `<ModuleConfiguration id="${this.id}" >`;
    }

}
