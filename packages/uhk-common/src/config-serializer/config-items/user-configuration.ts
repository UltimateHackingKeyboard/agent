import { assertUInt16 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';
import { Keymap } from './keymap';
import { Macro } from './macro';
import { ModuleConfiguration } from './module-configuration';
import { ConfigSerializer } from '../config-serializer';

export class UserConfiguration {

    @assertUInt16
    dataModelVersion: number;

    @assertUInt16
    userConfigurationLength: number;

    deviceName: string;

    moduleConfigurations: ModuleConfiguration[] = [];

    keymaps: Keymap[] = [];

    macros: Macro[] = [];

    constructor() {
        this.setDefaultDeviceName();
    }

    fromJsonObject(jsonObject: any): UserConfiguration {
        this.dataModelVersion = jsonObject.dataModelVersion;
        this.userConfigurationLength = jsonObject.userConfigurationLength;
        this.deviceName = jsonObject.deviceName;
        this.setDefaultDeviceName();
        this.moduleConfigurations = jsonObject.moduleConfigurations.map((moduleConfiguration: any) => {
            return new ModuleConfiguration().fromJsonObject(moduleConfiguration);
        });
        this.macros = jsonObject.macros.map((macroJsonObject: any, index: number) => {
            const macro = new Macro().fromJsonObject(macroJsonObject);
            macro.id = index;
            return macro;
        });
        this.keymaps = jsonObject.keymaps.map((keymap: any) => new Keymap().fromJsonObject(keymap, this.macros));
        this.recalculateConfigurationLength();
        return this;
    }

    fromBinary(buffer: UhkBuffer): UserConfiguration {
        this.dataModelVersion = buffer.readUInt16();
        this.userConfigurationLength = buffer.readUInt16();
        this.deviceName = buffer.readString();
        this.setDefaultDeviceName();
        this.moduleConfigurations = buffer.readArray<ModuleConfiguration>(uhkBuffer => {
            return new ModuleConfiguration().fromBinary(uhkBuffer);
        });
        this.macros = buffer.readArray<Macro>((uhkBuffer, index) => {
            const macro = new Macro().fromBinary(uhkBuffer);
            macro.id = index;
            return macro;
        });
        this.keymaps = buffer.readArray<Keymap>(uhkBuffer => new Keymap().fromBinary(uhkBuffer, this.macros));
        ConfigSerializer.resolveSwitchKeymapActions(this.keymaps);

        if (this.userConfigurationLength === 0) {
            this.recalculateConfigurationLength();
        }

        return this;
    }

    toJsonObject(): any {
        return {
            dataModelVersion: this.dataModelVersion,
            userConfigurationLength: this.userConfigurationLength,
            deviceName: this.deviceName,
            moduleConfigurations: this.moduleConfigurations.map(moduleConfiguration => moduleConfiguration.toJsonObject()),
            keymaps: this.keymaps.map(keymap => keymap.toJsonObject(this.macros)),
            macros: this.macros.map(macro => macro.toJsonObject())
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt16(this.dataModelVersion);
        buffer.writeUInt16(this.userConfigurationLength);
        buffer.writeString(this.deviceName);
        buffer.writeArray(this.moduleConfigurations);
        buffer.writeArray(this.macros);
        buffer.writeArray(this.keymaps, (uhkBuffer: UhkBuffer, keymap: Keymap) => {
            keymap.toBinary(uhkBuffer, this);
        });
    }

    toString(): string {
        return `<UserConfiguration dataModelVersion="${this.dataModelVersion}">`;
    }

    getKeymap(keymapAbbreviation: string): Keymap {
        return this.keymaps.find(keymap => keymapAbbreviation === keymap.abbreviation);
    }

    getMacro(macroId: number): Macro {
        return this.macros.find(macro => macroId === macro.id);
    }

    recalculateConfigurationLength(){
        const buffer = new UhkBuffer();
        this.toBinary(buffer);
        this.userConfigurationLength = buffer.offset;
    }

    private setDefaultDeviceName(): void {
        if (!this.deviceName || this.deviceName.trim().length === 0) {
            this.deviceName = 'My UHK';
        }
    }
}
