import {Serializable} from '../Serializable';
import {ModuleConfigurations} from './ModuleConfigurations';
import {Keymaps} from './Keymaps';
import {Keymap} from './Keymap';
import {Macros} from './Macros';
import {UhkBuffer} from '../UhkBuffer';
import {assertUInt8, assertUInt32} from '../assert';

export class UhkConfiguration extends Serializable<UhkConfiguration> {

    signature: string;

    @assertUInt8
    dataModelVersion: number;

    @assertUInt32
    prologue: number;

    @assertUInt8
    hardwareId: number;

    @assertUInt8
    brandId: number;

    moduleConfigurations: ModuleConfigurations;

    keymaps: Keymaps;

    macros: Macros;

    @assertUInt32
    epilogue: number;

    _fromJsObject(jsObject: any): UhkConfiguration {
        this.signature = jsObject.signature;
        this.dataModelVersion = jsObject.dataModelVersion;
        this.prologue = jsObject.prologue;
        this.hardwareId = jsObject.hardwareId;
        this.brandId = jsObject.brandId;
        this.moduleConfigurations = new ModuleConfigurations().fromJsObject(jsObject.moduleConfigurations);
        this.keymaps = new Keymaps().fromJsObject(jsObject.keymaps);
        this.macros = new Macros().fromJsObject(jsObject.macros);
        this.epilogue = jsObject.epilogue;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): UhkConfiguration {
        this.signature = buffer.readString();
        this.dataModelVersion = buffer.readUInt8();
        this.prologue = buffer.readUInt32();
        this.hardwareId = buffer.readUInt8();
        this.brandId = buffer.readUInt8();
        this.moduleConfigurations = new ModuleConfigurations().fromBinary(buffer);
        this.keymaps = new Keymaps().fromBinary(buffer);
        this.macros = new Macros().fromBinary(buffer);
        this.epilogue = buffer.readUInt32();
        return this;
    }

    _toJsObject(): any {
        return {
            signature: this.signature,
            dataModelVersion: this.dataModelVersion,
            prologue: this.prologue,
            hardwareId: this.hardwareId,
            brandId: this.brandId,
            moduleConfigurations: this.moduleConfigurations.toJsObject(),
            keymaps: this.keymaps.toJsObject(),
            macros: this.macros.toJsObject(),
            epilogue: this.epilogue
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeString(this.signature);
        buffer.writeUInt8(this.dataModelVersion);
        buffer.writeUInt32(this.prologue);
        buffer.writeUInt8(this.hardwareId);
        buffer.writeUInt8(this.brandId);
        this.moduleConfigurations.toBinary(buffer);
        this.keymaps.toBinary(buffer);
        this.macros.toBinary(buffer);
        buffer.writeUInt32(this.epilogue);
    }

    toString(): string {
        return `<UhkConfiguration signature="${this.signature}">`;
    }

    getKeymap(keymapId: number): Keymap {
        let keymaps: Keymap[] = this.keymaps.elements;
        for (let i = 0; i < keymaps.length; ++i) {
            if (keymapId === keymaps[i].id) {
                return keymaps[i];
            }
        }
    }
}
