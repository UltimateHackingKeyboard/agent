enum PointerRole {
    none,
    move,
    scroll
}

class Module extends Serializable<Module> {

    @assertEnum(PointerRole)
    private role: PointerRole;

    @assertUInt8
    moduleId: number;

    keyActions: Serializable<KeyActions>;

    _fromJsObject(jsObject: any): Module {
        this.moduleId = jsObject.moduleId;
        this.role = PointerRole[<string> jsObject.pointerRole];
        this.keyActions = new KeyActions().fromJsObject(jsObject.keyActions);
        /*
        console.log("ModuleId: "+this.moduleId);
        console.log("PointerRole:"+PointerRole[this.role]);
        */
        return this;
    }

    _fromBinary(buffer: UhkBuffer): Module {
        this.moduleId = buffer.readUInt8();
        this.role = buffer.readUInt8();
        this.keyActions = new KeyActions().fromBinary(buffer);
        return this;
    }

    _toJsObject(): any {
        return {
            moduleId: this.moduleId,
            pointerRole: PointerRole[this.role],
            keyActions: this.keyActions.toJsObject()
        }
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.moduleId);
        buffer.writeUInt8(this.role);
        this.keyActions.toBinary(buffer);
    }

    toString(): string {
        return `<Module moduleId="${this.moduleId}" role="${this.role}">`;
    }

}
