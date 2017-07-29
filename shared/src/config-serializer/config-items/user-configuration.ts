import { assertUInt16 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';
import { Keymap } from './keymap';
import { Macro } from './macro';
import { ModuleConfiguration } from './module-configuration';

export class UserConfiguration {

    @assertUInt16
    dataModelVersion: number;

    moduleConfigurations: ModuleConfiguration[] = [];

    keymaps: Keymap[] = [];

    macros: Macro[] = [];

    fromJsonObject(jsonObject: any): UserConfiguration {
        this.dataModelVersion = jsonObject.dataModelVersion;
        this.moduleConfigurations = jsonObject.moduleConfigurations.map((moduleConfiguration: any) => {
            return new ModuleConfiguration().fromJsonObject(moduleConfiguration);
        });
        this.macros = jsonObject.macros.map((macroJsonObject: any, index: number) => {
            const macro = new Macro().fromJsonObject(macroJsonObject);
            macro.id = index;
            return macro;
        });
        this.keymaps = jsonObject.keymaps.map((keymap: any) => new Keymap().fromJsonObject(keymap, this.macros));
        return this;
    }

    toJsonObject(): any {
        return {
            dataModelVersion: this.dataModelVersion,
            moduleConfigurations: this.moduleConfigurations.map(moduleConfiguration => moduleConfiguration.toJsonObject()),
            keymaps: this.keymaps.map(keymap => keymap.toJsonObject(this.macros)),
            macros: this.macros.map(macro => macro.toJsonObject())
        };
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

}
