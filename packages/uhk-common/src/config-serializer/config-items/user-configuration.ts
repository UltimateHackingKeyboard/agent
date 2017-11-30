import { assertUInt16 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';
import { Keymap } from './keymap';
import { Macro } from './macro';
import { ModuleConfiguration } from './module-configuration';
import { ConfigSerializer } from '../config-serializer';

export class UserConfiguration {

    @assertUInt16
    dataModelMajorVersion: number;

    @assertUInt16
    dataModelMinorVersion: number;

    @assertUInt16
    dataModelPatchVersion: number;

    @assertUInt16
    userConfigurationLength: number;

    deviceName: string;

    @assertUInt16
    doubleTapSwitchLayerTimeout: number;

//    @assertUInt8
    iconsAndLayerTextsBrightness: number;

//    @assertUInt8
    alphanumericSegmentsBrightness: number;

//    @assertUInt8
    keyBacklightBrightness: number;

//    @assertUInt8
    mouseMoveInitialSpeed: number;

//    @assertUInt8
    mouseMoveAcceleration: number;

//    @assertUInt8
    mouseMoveDeceleratedSpeed: number;

//    @assertUInt8
    mouseMoveBaseSpeed: number;

//    @assertUInt8
    mouseMoveAcceleratedSpeed: number;

//    @assertUInt8
    mouseScrollInitialSpeed: number;

//    @assertUInt8
    mouseScrollAcceleration: number;

//    @assertUInt8
    mouseScrollDeceleratedSpeed: number;

//    @assertUInt8
    mouseScrollBaseSpeed: number;

//    @assertUInt8
    mouseScrollAcceleratedSpeed: number;

    moduleConfigurations: ModuleConfiguration[] = [];

    keymaps: Keymap[] = [];

    macros: Macro[] = [];

    constructor() {
        this.setDefaultDeviceName();
    }

    fromJsonObject(jsonObject: any): UserConfiguration {
        this.dataModelMajorVersion = jsonObject.dataModelMajorVersion;
        this.dataModelMinorVersion = jsonObject.dataModelMinorVersion;
        this.dataModelPatchVersion = jsonObject.dataModelPatchVersion;
        this.deviceName = jsonObject.deviceName;
        this.setDefaultDeviceName();
        this.doubleTapSwitchLayerTimeout = jsonObject.doubleTapSwitchLayerTimeout;
        this.iconsAndLayerTextsBrightness = jsonObject.iconsAndLayerTextsBrightness;
        this.alphanumericSegmentsBrightness = jsonObject.alphanumericSegmentsBrightness;
        this.keyBacklightBrightness = jsonObject.keyBacklightBrightness;
        this.mouseMoveInitialSpeed = jsonObject.mouseMoveInitialSpeed;
        this.mouseMoveAcceleration = jsonObject.mouseMoveAcceleration;
        this.mouseMoveDeceleratedSpeed = jsonObject.mouseMoveDeceleratedSpeed;
        this.mouseMoveBaseSpeed = jsonObject.mouseMoveBaseSpeed;
        this.mouseMoveAcceleratedSpeed = jsonObject.mouseMoveAcceleratedSpeed;
        this.mouseScrollInitialSpeed = jsonObject.mouseScrollInitialSpeed;
        this.mouseScrollAcceleration = jsonObject.mouseScrollAcceleration;
        this.mouseScrollDeceleratedSpeed = jsonObject.mouseScrollAcceleration;
        this.mouseScrollBaseSpeed = jsonObject.mouseScrollBaseSpeed;
        this.mouseScrollAcceleratedSpeed = jsonObject.mouseScrollAcceleratedSpeed;
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
        this.dataModelMajorVersion = buffer.readUInt16();
        this.dataModelMinorVersion = buffer.readUInt16();
        this.dataModelPatchVersion = buffer.readUInt16();
        this.userConfigurationLength = buffer.readUInt16();
        this.deviceName = buffer.readString();
        this.setDefaultDeviceName();
        this.doubleTapSwitchLayerTimeout = buffer.readUInt16();
        this.iconsAndLayerTextsBrightness = buffer.readUInt8();
        this.alphanumericSegmentsBrightness = buffer.readUInt8();
        this.keyBacklightBrightness = buffer.readUInt8();
        this.mouseMoveInitialSpeed = buffer.readUInt8();
        this.mouseMoveAcceleration = buffer.readUInt8();
        this.mouseMoveDeceleratedSpeed = buffer.readUInt8();
        this.mouseMoveBaseSpeed = buffer.readUInt8();
        this.mouseMoveAcceleratedSpeed = buffer.readUInt8();
        this.mouseScrollInitialSpeed = buffer.readUInt8();
        this.mouseScrollAcceleration = buffer.readUInt8();
        this.mouseScrollDeceleratedSpeed = buffer.readUInt8();
        this.mouseScrollBaseSpeed = buffer.readUInt8();
        this.mouseScrollAcceleratedSpeed = buffer.readUInt8();
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
            dataModelMajorVersion: this.dataModelMajorVersion,
            dataModelMinorVersion: this.dataModelMinorVersion,
            dataModelPatchVersion: this.dataModelPatchVersion,
            deviceName: this.deviceName,
            doubleTapSwitchLayerTimeout: this.doubleTapSwitchLayerTimeout,
            iconsAndLayerTextsBrightness: this.iconsAndLayerTextsBrightness,
            alphanumericSegmentsBrightness: this.alphanumericSegmentsBrightness,
            keyBacklightBrightness: this.keyBacklightBrightness,
            mouseMoveInitialSpeed: this.mouseMoveInitialSpeed,
            mouseMoveAcceleration: this.mouseMoveAcceleration,
            mouseMoveDeceleratedSpeed: this.mouseMoveDeceleratedSpeed,
            mouseMoveBaseSpeed: this.mouseMoveBaseSpeed,
            mouseMoveAcceleratedSpeed: this.mouseMoveAcceleratedSpeed,
            mouseScrollInitialSpeed: this.mouseScrollInitialSpeed,
            mouseScrollAcceleration: this.mouseScrollAcceleration,
            mouseScrollDeceleratedSpeed: this.mouseScrollDeceleratedSpeed,
            mouseScrollBaseSpeed: this.mouseScrollBaseSpeed,
            mouseScrollAcceleratedSpeed: this.mouseScrollAcceleratedSpeed,
            moduleConfigurations: this.moduleConfigurations.map(moduleConfiguration => moduleConfiguration.toJsonObject()),
            keymaps: this.keymaps.map(keymap => keymap.toJsonObject(this.macros)),
            macros: this.macros.map(macro => macro.toJsonObject())
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt16(this.dataModelMajorVersion);
        buffer.writeUInt16(this.dataModelMinorVersion);
        buffer.writeUInt16(this.dataModelPatchVersion);
        buffer.writeUInt16(this.userConfigurationLength);
        buffer.writeString(this.deviceName);
        buffer.writeUInt16(this.doubleTapSwitchLayerTimeout);
        buffer.writeUInt8(this.iconsAndLayerTextsBrightness);
        buffer.writeUInt8(this.alphanumericSegmentsBrightness);
        buffer.writeUInt8(this.keyBacklightBrightness);
        buffer.writeUInt8(this.mouseMoveInitialSpeed);
        buffer.writeUInt8(this.mouseMoveAcceleration);
        buffer.writeUInt8(this.mouseMoveDeceleratedSpeed);
        buffer.writeUInt8(this.mouseMoveBaseSpeed);
        buffer.writeUInt8(this.mouseMoveAcceleratedSpeed);
        buffer.writeUInt8(this.mouseScrollInitialSpeed);
        buffer.writeUInt8(this.mouseScrollAcceleration);
        buffer.writeUInt8(this.mouseScrollDeceleratedSpeed);
        buffer.writeUInt8(this.mouseScrollBaseSpeed);
        buffer.writeUInt8(this.mouseScrollAcceleratedSpeed);
        buffer.writeArray(this.moduleConfigurations);
        buffer.writeArray(this.macros);
        buffer.writeArray(this.keymaps, (uhkBuffer: UhkBuffer, keymap: Keymap) => {
            keymap.toBinary(uhkBuffer, this);
        });
    }

    toString(): string {
        return `<UserConfiguration dataModelVersion="${this.dataModelMajorVersion}.\
               ${this.dataModelMinorVersion}.${this.dataModelPatchVersion}">`;
    }

    getKeymap(keymapAbbreviation: string): Keymap {
        return this.keymaps.find(keymap => keymapAbbreviation === keymap.abbreviation);
    }

    getMacro(macroId: number): Macro {
        return this.macros.find(macro => macroId === macro.id);
    }

    recalculateConfigurationLength() {
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
