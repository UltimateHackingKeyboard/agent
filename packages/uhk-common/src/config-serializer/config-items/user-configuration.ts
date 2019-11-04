import { assertUInt16, assertUInt8 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';
import { Keymap } from './keymap';
import { Macro } from './macro';
import { ModuleConfiguration } from './module-configuration';
import { ConfigSerializer } from '../config-serializer';
import { KeystrokeAction, NoneAction } from './key-action';
import { SecondaryRoleAction } from './secondary-role-action';
import { isScancodeExists } from './scancode-checker';
import { MouseSpeedConfiguration } from './mouse-speed-configuration';

export class UserConfiguration implements MouseSpeedConfiguration {

    @assertUInt16
    userConfigMajorVersion: number;

    @assertUInt16
    userConfigMinorVersion: number;

    @assertUInt16
    userConfigPatchVersion: number;

    @assertUInt16
    userConfigurationLength: number;

    deviceName: string;

    @assertUInt16
    doubleTapSwitchLayerTimeout: number;

    @assertUInt8
    iconsAndLayerTextsBrightness: number;

    @assertUInt8
    alphanumericSegmentsBrightness: number;

    @assertUInt8
    keyBacklightBrightness: number;

    @assertUInt8
    mouseMoveInitialSpeed: number;

    @assertUInt8
    mouseMoveAcceleration: number;

    @assertUInt8
    mouseMoveDeceleratedSpeed: number;

    @assertUInt8
    mouseMoveBaseSpeed: number;

    @assertUInt8
    mouseMoveAcceleratedSpeed: number;

    @assertUInt8
    mouseScrollInitialSpeed: number;

    @assertUInt8
    mouseScrollAcceleration: number;

    @assertUInt8
    mouseScrollDeceleratedSpeed: number;

    @assertUInt8
    mouseScrollBaseSpeed: number;

    @assertUInt8
    mouseScrollAcceleratedSpeed: number;

    moduleConfigurations: ModuleConfiguration[] = [];

    keymaps: Keymap[] = [];

    macros: Macro[] = [];

    constructor() {
        this.setDefaultDeviceName();
    }

    fromJsonObject(jsonObject: any): UserConfiguration {
        this.userConfigMajorVersion = jsonObject.userConfigMajorVersion;
        this.userConfigMinorVersion = jsonObject.userConfigMinorVersion;
        this.userConfigPatchVersion = jsonObject.userConfigPatchVersion;
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
        this.mouseScrollDeceleratedSpeed = jsonObject.mouseScrollDeceleratedSpeed;
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
        this.clean();
        this.recalculateConfigurationLength();

        return this;
    }

    fromBinary(buffer: UhkBuffer): UserConfiguration {
        this.userConfigMajorVersion = buffer.readUInt16();
        this.userConfigMinorVersion = buffer.readUInt16();
        this.userConfigPatchVersion = buffer.readUInt16();
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

        this.clean();

        if (this.userConfigurationLength === 0) {
            this.recalculateConfigurationLength();
        }

        return this;
    }

    toJsonObject(): any {
        return {
            userConfigMajorVersion: this.userConfigMajorVersion,
            userConfigMinorVersion: this.userConfigMinorVersion,
            userConfigPatchVersion: this.userConfigPatchVersion,
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
        buffer.writeUInt16(this.userConfigMajorVersion);
        buffer.writeUInt16(this.userConfigMinorVersion);
        buffer.writeUInt16(this.userConfigPatchVersion);
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
        // buffer.writeUInt8(+this.everAttemptedSavingToKeyboard);
        buffer.writeArray(this.moduleConfigurations);
        buffer.writeArray(this.macros);
        buffer.writeArray(this.keymaps, (uhkBuffer: UhkBuffer, keymap: Keymap) => {
            keymap.toBinary(uhkBuffer, this);
        });
    }

    toString(): string {
        return `<UserConfiguration userConfigVersion="${this.userConfigMajorVersion}.\
               ${this.userConfigMinorVersion}.${this.userConfigPatchVersion}">`;
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

    /* Remove not allowed settings/bugs
     * 1. Layer Switcher secondary roles allowed only on base layers
     */
    private clean(): void {
        for (const keymap of this.keymaps) {
            for (let layerId = 1; layerId < keymap.layers.length; layerId++) {
                const layer = keymap.layers[layerId];

                for (const module of layer.modules) {
                    for (let keyActionId = 0; keyActionId < module.keyActions.length; keyActionId++) {
                        const keyAction = module.keyActions[keyActionId];
                        if (!keyAction || !(keyAction instanceof KeystrokeAction)) {
                            continue;
                        }

                        if (keyAction.secondaryRoleAction === SecondaryRoleAction.fn ||
                            keyAction.secondaryRoleAction === SecondaryRoleAction.mod ||
                            keyAction.secondaryRoleAction === SecondaryRoleAction.mouse) {
                            (keyAction as any)._secondaryRoleAction = undefined;
                        }

                        if (keyAction.hasScancode() && !isScancodeExists(keyAction.scancode)) {
                            module.keyActions[keyActionId] = new NoneAction();
                        }
                    }
                }
            }
        }
    }
}
