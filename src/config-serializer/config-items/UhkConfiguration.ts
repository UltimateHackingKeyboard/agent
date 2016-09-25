import { assertUInt32, assertUInt8 } from '../assert';
import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { Keymap } from './Keymap';
import { Macro } from './Macro';
import { ModuleConfiguration } from './ModuleConfiguration';

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

    moduleConfigurations: ModuleConfiguration[];

    keymaps: Keymap[];

    macros: Macro[];

    @assertUInt32
    epilogue: number;

    _fromJsObject(jsObject: any): UhkConfiguration {
        this.signature = jsObject.signature;
        this.dataModelVersion = jsObject.dataModelVersion;
        this.prologue = jsObject.prologue;
        this.hardwareId = jsObject.hardwareId;
        this.brandId = jsObject.brandId;
        this.moduleConfigurations = jsObject.moduleConfigurations.map((moduleConfiguration: any) => {
            return new ModuleConfiguration().fromJsObject(moduleConfiguration);
        });
        this.keymaps = jsObject.keymaps.map((keymap: any) => new Keymap().fromJsObject(keymap));
        this.macros = jsObject.macros.map((macro: any) => new Macro().fromJsObject(macro));
        this.epilogue = jsObject.epilogue;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): UhkConfiguration {
        this.signature = buffer.readString();
        this.dataModelVersion = buffer.readUInt8();
        this.prologue = buffer.readUInt32();
        this.hardwareId = buffer.readUInt8();
        this.brandId = buffer.readUInt8();
        this.moduleConfigurations = buffer.readArray<ModuleConfiguration>(ModuleConfiguration);
        this.keymaps = buffer.readArray<Keymap>(Keymap);
        this.macros = buffer.readArray<Macro>(Macro);
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
            moduleConfigurations: this.moduleConfigurations.map(moduleConfiguration => moduleConfiguration.toJsObject()),
            keymaps: this.keymaps.map(keymap => keymap.toJsObject()),
            macros: this.macros.map(macro => macro.toJsObject()),
            epilogue: this.epilogue
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeString(this.signature);
        buffer.writeUInt8(this.dataModelVersion);
        buffer.writeUInt32(this.prologue);
        buffer.writeUInt8(this.hardwareId);
        buffer.writeUInt8(this.brandId);
        buffer.writeArray(this.moduleConfigurations);
        buffer.writeArray(this.keymaps);
        buffer.writeArray(this.macros);
        buffer.writeUInt32(this.epilogue);
    }

    toString(): string {
        return `<UhkConfiguration signature="${this.signature}">`;
    }

    getKeymap(keymapAbbreviation: string): Keymap {
        return this.keymaps.find(keymap => keymapAbbreviation === keymap.abbreviation);
    }

    getMacro(macroId: number): Macro {
        return this.macros.find(macro => macroId === macro.id);
    }
}
