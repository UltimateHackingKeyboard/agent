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

    fromJsonObject(jsonObject: any): UhkConfiguration {
        this.signature = jsonObject.signature;
        this.dataModelVersion = jsonObject.dataModelVersion;
        this.prologue = jsonObject.prologue;
        this.hardwareId = jsonObject.hardwareId;
        this.brandId = jsonObject.brandId;
        this.moduleConfigurations = jsonObject.moduleConfigurations.map((moduleConfiguration: any) => {
            return new ModuleConfiguration().fromJsonObject(moduleConfiguration);
        });
        this.macros = jsonObject.macros.map((macro: any) => new Macro().fromJsonObject(macro));
        this.keymaps = jsonObject.keymaps.map((keymap: any) => {
            const newKeymap = new Keymap();
            newKeymap.abbreviation = keymap.abbreviation;
            return newKeymap;
        });
        for (let i = 0; i < this.keymaps.length; ++i) {
            this.keymaps[i].fromJsonObject(jsonObject.keymaps[i], this.keymaps, this.macros);
        }
        this.epilogue = jsonObject.epilogue;
        return this;
    }

    fromBinary(buffer: UhkBuffer): UhkConfiguration {
        this.signature = buffer.readString();
        this.dataModelVersion = buffer.readUInt8();
        this.prologue = buffer.readUInt32();
        this.hardwareId = buffer.readUInt8();
        this.brandId = buffer.readUInt8();
        this.moduleConfigurations = buffer.readArray<ModuleConfiguration>(uhkBuffer => {
            return new ModuleConfiguration().fromBinary(uhkBuffer);
        });
        this.macros = buffer.readArray<Macro>(uhkBuffer => new Macro().fromBinary(uhkBuffer));
        let numKeymaps: number = buffer.readCompactLength();
        const offset = buffer.offset;
        this.keymaps = new Array<Keymap>(numKeymaps).fill(undefined).map(() => {
            return new Keymap().fromBinary(buffer);
        });
        buffer.offset = offset;
        this.keymaps = this.keymaps.map(() => {
            return new Keymap().fromBinary(buffer, this.keymaps, this.macros);
        });
        this.epilogue = buffer.readUInt32();
        return this;
    }

    _toJsonObject(): any {
        return {
            signature: this.signature,
            dataModelVersion: this.dataModelVersion,
            prologue: this.prologue,
            hardwareId: this.hardwareId,
            brandId: this.brandId,
            moduleConfigurations: this.moduleConfigurations.map(moduleConfiguration => moduleConfiguration.toJsonObject()),
            keymaps: this.keymaps.map(keymap => keymap.toJsonObject()),
            macros: this.macros.map(macro => macro.toJsonObject()),
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
        buffer.writeArray(this.macros);
        buffer.writeArray(this.keymaps);
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
