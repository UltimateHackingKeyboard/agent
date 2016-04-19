class ModuleConfiguration extends Serializable<ModuleConfiguration> {

    /*
     * module id enumeration is a separate story
     */

    // @assertUInt8
    id: number;

    // @assertUInt8
    initialPointerSpeed: number;

    // @assertUInt8
    pointerAcceleration: number;

    // @assertUInt8
    maxPointerSpeed: number;

    _fromJsObject(jsObject: any): ModuleConfiguration {
        this.id = jsObject.id;
        this.initialPointerSpeed = jsObject.initialPointerSpeed;
        this.pointerAcceleration = jsObject.pointerAcceleration;
        this.maxPointerSpeed = jsObject.maxPointerSpeed;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ModuleConfiguration {
        this.id = buffer.readUInt8();
        this.initialPointerSpeed = buffer.readUInt8();
        this.pointerAcceleration = buffer.readUInt8();
        this.maxPointerSpeed = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
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
