import { assertFloat } from '../assert.js';
import { assertInt16 } from '../assert.js';
import { assertEnum, assertUInt16, assertUInt32, assertUInt8 } from '../assert.js';
import { ConfigSerializer } from '../config-serializer.js';
import { UhkBuffer } from '../uhk-buffer.js';
import { BacklightingMode } from './backlighting-mode.js';
import { KeystrokeAction, NoneAction } from './key-action/index.js';
import { Keymap } from './keymap.js';
import { LayerName } from './layer-name.js';
import { Macro } from './macro.js';
import { ModuleConfiguration } from './module-configuration.js';
import { defaultKeyClusterLeftModuleConfig } from './module-configuration/default-key-cluster-left-module-config.js';
import { defaultTouchpadRightModuleConfig } from './module-configuration/default-touchpad-right-module-config.js';
import { defaultTrackballRightModuleConfig } from './module-configuration/default-trackball-right-module-config.js';
import { defaultTrackpointRightModuleConfig } from './module-configuration/default-trackpoint-right-module-config.js';
import { MouseSpeedConfiguration } from './mouse-speed-configuration.js';
import { RgbColor } from './rgb-color.js';
import { isAllowedScancode } from './scancode-checker.js';
import { SecondaryRoleAction } from './secondary-role-action.js';
import { SecondaryRoleAdvancedStrategyTimeoutAction } from './secondary-role-advanced-strategy-timeout-action.js';
import { SecondaryRoleStrategy } from './secondary-role-strategy.js';
import { SerialisationInfo } from './serialisation-info.js';

export class UserConfiguration implements MouseSpeedConfiguration {

    @assertUInt16 userConfigMajorVersion: number;

    @assertUInt16 userConfigMinorVersion: number;

    @assertUInt16 userConfigPatchVersion: number;

    @assertUInt32 userConfigurationLength: number;

    deviceName: string;

    @assertUInt16 doubleTapSwitchLayerTimeout: number;

    @assertUInt8 iconsAndLayerTextsBrightness: number;

    @assertUInt8 alphanumericSegmentsBrightness: number;

    @assertUInt8 keyBacklightBrightness: number;

    @assertUInt16 ledsFadeTimeout: number;

    perKeyRgbPresent: boolean;

    @assertEnum(BacklightingMode) backlightingMode: BacklightingMode;

    backlightingNoneActionColor: RgbColor;

    backlightingScancodeColor: RgbColor;

    backlightingModifierColor: RgbColor;

    backlightingShortcutColor: RgbColor;

    backlightingSwitchLayerColor: RgbColor;

    backlightingSwitchKeymapColor: RgbColor;

    backlightingMouseColor: RgbColor;

    backlightingMacroColor: RgbColor;

    @assertUInt8 mouseMoveInitialSpeed: number;

    @assertUInt8 mouseMoveAcceleration: number;

    @assertUInt8 mouseMoveDeceleratedSpeed: number;

    @assertUInt8 mouseMoveBaseSpeed: number;

    @assertUInt8 mouseMoveAcceleratedSpeed: number;

    @assertUInt8 mouseScrollInitialSpeed: number;

    @assertUInt8 mouseScrollAcceleration: number;

    @assertUInt8 mouseScrollDeceleratedSpeed: number;

    @assertUInt8 mouseScrollBaseSpeed: number;

    @assertUInt8 mouseScrollAcceleratedSpeed: number;

    @assertEnum(SecondaryRoleStrategy) secondaryRoleStrategy: SecondaryRoleStrategy;

    @assertUInt16 secondaryRoleAdvancedStrategyDoubletapTimeout: number;

    @assertUInt16 secondaryRoleAdvancedStrategyTimeout: number;

    @assertInt16 secondaryRoleAdvancedStrategySafetyMargin: number;

    secondaryRoleAdvancedStrategyTriggerByRelease: boolean;

    secondaryRoleAdvancedStrategyDoubletapToPrimary: boolean;

    @assertEnum(SecondaryRoleAdvancedStrategyTimeoutAction) secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction;

    @assertFloat mouseScrollAxisSkew: number;

    @assertFloat mouseMoveAxisSkew: number;

    diagonalSpeedCompensation: boolean;

    @assertUInt16 doubletapTimeout: number;

    @assertUInt16 keystrokeDelay: number;

    moduleConfigurations: ModuleConfiguration[] = [];

    keymaps: Keymap[] = [];

    macros: Macro[] = [];

    constructor() {
        this.setDefaultDeviceName();
    }

    clone(): UserConfiguration {
        const userConfig = Object.assign(new UserConfiguration(), this);
        userConfig.keymaps = userConfig.keymaps.map(keymap => new Keymap(keymap));
        userConfig.macros = userConfig.macros.map(macro => new Macro(macro));

        return userConfig;
    }

    fromJsonObject(jsonObject: any): UserConfiguration {
        this.userConfigMajorVersion = jsonObject.userConfigMajorVersion;
        this.userConfigMinorVersion = jsonObject.userConfigMinorVersion;
        this.userConfigPatchVersion = jsonObject.userConfigPatchVersion;

        switch (this.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject);
                break;

            case 6:
                this.fromJsonObjectV6(jsonObject);
                break;

            case 7:
                this.fromJsonObjectV7(jsonObject);
                break;

            default:
                throw new Error(`User configuration does not support version: ${this.userConfigMajorVersion}`);
        }

        this.clean();
        this.migrateToV5();
        this.migrateToV6();
        this.migrateToV7();
        this.recalculateConfigurationLength();

        return this;
    }

    fromBinary(buffer: UhkBuffer): UserConfiguration {
        this.userConfigMajorVersion = buffer.readUInt16();
        this.userConfigMinorVersion = buffer.readUInt16();
        this.userConfigPatchVersion = buffer.readUInt16();

        switch (this.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer);
                break;

            case 6:
                this.fromBinaryV6(buffer);
                break;

            case 7:
                this.fromBinaryV7(buffer);
                break;

            default:
                throw new Error(`User configuration does not support version: ${this.userConfigMajorVersion}`);
        }

        this.clean();
        if (this.migrateToV5()) {
            this.userConfigurationLength = 0;
        }

        if (this.migrateToV6()) {
            this.userConfigurationLength = 0;
        }

        if (this.migrateToV7()) {
            this.userConfigurationLength = 0;
        }

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
            ledsFadeTimeout: this.ledsFadeTimeout,
            perKeyRgbPresent: this.perKeyRgbPresent,
            backlightingMode: BacklightingMode[this.backlightingMode],
            backlightingNoneActionColor: this.backlightingNoneActionColor.toJsonObject(),
            backlightingScancodeColor: this.backlightingScancodeColor.toJsonObject(),
            backlightingModifierColor: this.backlightingModifierColor.toJsonObject(),
            backlightingShortcutColor: this.backlightingShortcutColor.toJsonObject(),
            backlightingSwitchLayerColor: this.backlightingSwitchLayerColor.toJsonObject(),
            backlightingSwitchKeymapColor: this.backlightingSwitchKeymapColor.toJsonObject(),
            backlightingMouseColor: this.backlightingMouseColor.toJsonObject(),
            backlightingMacroColor: this.backlightingMacroColor.toJsonObject(),
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
            secondaryRoleStrategy: SecondaryRoleStrategy[this.secondaryRoleStrategy],
            secondaryRoleAdvancedStrategyDoubletapTimeout: this.secondaryRoleAdvancedStrategyDoubletapTimeout,
            secondaryRoleAdvancedStrategyTimeout: this.secondaryRoleAdvancedStrategyTimeout,
            secondaryRoleAdvancedStrategySafetyMargin: this.secondaryRoleAdvancedStrategySafetyMargin,
            secondaryRoleAdvancedStrategyTriggerByRelease: this.secondaryRoleAdvancedStrategyTriggerByRelease,
            secondaryRoleAdvancedStrategyDoubletapToPrimary: this.secondaryRoleAdvancedStrategyDoubletapToPrimary,
            secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction[this.secondaryRoleAdvancedStrategyTimeoutAction],
            mouseScrollAxisSkew: this.mouseScrollAxisSkew,
            mouseMoveAxisSkew: this.mouseMoveAxisSkew,
            diagonalSpeedCompensation: this.diagonalSpeedCompensation,
            doubletapTimeout: this.doubletapTimeout,
            keystrokeDelay: this.keystrokeDelay,
            moduleConfigurations: this.moduleConfigurations.map(moduleConfiguration => moduleConfiguration.toJsonObject()),
            keymaps: this.keymaps.map(keymap => keymap.toJsonObject(this.getSerialisationInfo(), this.macros)),
            macros: this.macros.map(macro => macro.toJsonObject())
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt16(this.userConfigMajorVersion);
        buffer.writeUInt16(this.userConfigMinorVersion);
        buffer.writeUInt16(this.userConfigPatchVersion);
        buffer.writeUInt32(this.userConfigurationLength);
        buffer.writeString(this.deviceName);
        buffer.writeUInt16(this.doubleTapSwitchLayerTimeout);
        buffer.writeUInt8(this.iconsAndLayerTextsBrightness);
        buffer.writeUInt8(this.alphanumericSegmentsBrightness);
        buffer.writeUInt8(this.keyBacklightBrightness);
        buffer.writeUInt16(this.ledsFadeTimeout);
        buffer.writeBoolean(this.perKeyRgbPresent);
        buffer.writeUInt8(this.backlightingMode);
        this.backlightingNoneActionColor.toBinary(buffer);
        this.backlightingScancodeColor.toBinary(buffer);
        this.backlightingModifierColor.toBinary(buffer);
        this.backlightingShortcutColor.toBinary(buffer);
        this.backlightingSwitchLayerColor.toBinary(buffer);
        this.backlightingSwitchKeymapColor.toBinary(buffer);
        this.backlightingMouseColor.toBinary(buffer);
        this.backlightingMacroColor.toBinary(buffer);
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

        buffer.writeUInt8(this.secondaryRoleStrategy);
        buffer.writeUInt16(this.secondaryRoleAdvancedStrategyDoubletapTimeout);
        buffer.writeUInt16(this.secondaryRoleAdvancedStrategyTimeout);
        buffer.writeUInt16(this.secondaryRoleAdvancedStrategySafetyMargin);
        buffer.writeBoolean(this.secondaryRoleAdvancedStrategyTriggerByRelease);
        buffer.writeBoolean(this.secondaryRoleAdvancedStrategyDoubletapToPrimary);
        buffer.writeUInt8(this.secondaryRoleAdvancedStrategyTimeoutAction);
        buffer.writeFloat(this.mouseScrollAxisSkew);
        buffer.writeFloat(this.mouseMoveAxisSkew);
        buffer.writeBoolean(this.diagonalSpeedCompensation);
        buffer.writeUInt16(this.doubletapTimeout);
        buffer.writeUInt16(this.keystrokeDelay);

        buffer.writeArray(this.moduleConfigurations);
        buffer.writeArray(this.macros);
        buffer.writeArray(this.keymaps, (uhkBuffer: UhkBuffer, keymap: Keymap) => {
            keymap.toBinary(uhkBuffer, this.getSerialisationInfo(), this);
        });
    }

    toString(): string {
        return `<UserConfiguration userConfigVersion="${this.userConfigMajorVersion}.\
               ${this.userConfigMinorVersion}.${this.userConfigPatchVersion}">`;
    }

    getKeymap(keymapAbbreviation: string): Keymap {
        return this.keymaps.find(keymap => keymapAbbreviation === keymap.abbreviation);
    }

    getSemanticVersion(): string {
        return `${this.userConfigMajorVersion}.${this.userConfigMinorVersion}.${this.userConfigPatchVersion}`;
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

                        if (keyAction.hasScancode() && !isAllowedScancode(keyAction)) {
                            module.keyActions[keyActionId] = new NoneAction();
                        }
                    }
                }
            }
        }
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
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
        const serialisationInfo = this.getSerialisationInfo();
        this.moduleConfigurations = buffer.readArray<ModuleConfiguration>(uhkBuffer => {
            return new ModuleConfiguration().fromBinary(uhkBuffer, serialisationInfo);
        });
        this.macros = buffer.readArray<Macro>((uhkBuffer, index) => {
            const macro = new Macro().fromBinary(uhkBuffer, serialisationInfo);
            macro.id = index;
            return macro;
        });
        this.keymaps = buffer.readArray<Keymap>(uhkBuffer => new Keymap().fromBinary(uhkBuffer, this.macros, serialisationInfo));
        ConfigSerializer.resolveSwitchKeymapActions(this.keymaps);

    }

    private fromBinaryV6(buffer: UhkBuffer): void {
        this.userConfigurationLength = buffer.readUInt32();
        this.deviceName = buffer.readString();
        this.setDefaultDeviceName();
        this.doubleTapSwitchLayerTimeout = buffer.readUInt16();
        this.iconsAndLayerTextsBrightness = buffer.readUInt8();
        this.alphanumericSegmentsBrightness = buffer.readUInt8();
        this.keyBacklightBrightness = buffer.readUInt8();
        this.ledsFadeTimeout = buffer.readUInt16();
        this.perKeyRgbPresent = buffer.readBoolean();
        this.backlightingMode = buffer.readUInt8();
        this.backlightingNoneActionColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingScancodeColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingModifierColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingShortcutColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingSwitchLayerColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingSwitchKeymapColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingMouseColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingMacroColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
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
        const serialisationInfo = this.getSerialisationInfo();
        this.moduleConfigurations = buffer.readArray<ModuleConfiguration>(uhkBuffer => {
            return new ModuleConfiguration().fromBinary(uhkBuffer, serialisationInfo);
        });
        this.macros = buffer.readArray<Macro>((uhkBuffer, index) => {
            const macro = new Macro().fromBinary(uhkBuffer, serialisationInfo);
            macro.id = index;
            return macro;
        });
        this.keymaps = buffer.readArray<Keymap>(uhkBuffer => new Keymap().fromBinary(uhkBuffer, this.macros, serialisationInfo));
        ConfigSerializer.resolveSwitchKeymapActions(this.keymaps);

    }

    private fromBinaryV7(buffer: UhkBuffer): void {
        this.userConfigurationLength = buffer.readUInt32();
        this.deviceName = buffer.readString();
        this.setDefaultDeviceName();
        this.doubleTapSwitchLayerTimeout = buffer.readUInt16();
        this.iconsAndLayerTextsBrightness = buffer.readUInt8();
        this.alphanumericSegmentsBrightness = buffer.readUInt8();
        this.keyBacklightBrightness = buffer.readUInt8();
        this.ledsFadeTimeout = buffer.readUInt16();
        this.perKeyRgbPresent = buffer.readBoolean();
        this.backlightingMode = buffer.readUInt8();
        this.backlightingNoneActionColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingScancodeColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingModifierColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingShortcutColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingSwitchLayerColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingSwitchKeymapColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingMouseColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
        this.backlightingMacroColor = new RgbColor().fromBinary(buffer, this.userConfigMajorVersion);
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

        this.secondaryRoleStrategy = buffer.readUInt8();
        this.secondaryRoleAdvancedStrategyDoubletapTimeout = buffer.readUInt16();
        this.secondaryRoleAdvancedStrategyTimeout = buffer.readUInt16();
        this.secondaryRoleAdvancedStrategySafetyMargin = buffer.readInt16();
        this.secondaryRoleAdvancedStrategyTriggerByRelease = buffer.readBoolean();
        this.secondaryRoleAdvancedStrategyDoubletapToPrimary = buffer.readBoolean();
        this.secondaryRoleAdvancedStrategyTimeoutAction = buffer.readUInt8();
        this.mouseScrollAxisSkew = buffer.readFloat();
        this.mouseMoveAxisSkew = buffer.readFloat();
        this.diagonalSpeedCompensation = buffer.readBoolean();
        this.doubletapTimeout = buffer.readUInt16();
        this.keystrokeDelay = buffer.readUInt16();

        const serialisationInfo = this.getSerialisationInfo();
        this.moduleConfigurations = buffer.readArray<ModuleConfiguration>(uhkBuffer => {
            return new ModuleConfiguration().fromBinary(uhkBuffer, serialisationInfo);
        });
        this.macros = buffer.readArray<Macro>((uhkBuffer, index) => {
            const macro = new Macro().fromBinary(uhkBuffer, serialisationInfo);
            macro.id = index;
            return macro;
        });
        this.keymaps = buffer.readArray<Keymap>(uhkBuffer => new Keymap().fromBinary(uhkBuffer, this.macros, serialisationInfo));
        ConfigSerializer.resolveSwitchKeymapActions(this.keymaps);

    }

    private fromJsonObjectV1(jsonObject: any): void {
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
        const serialisationInfo = this.getSerialisationInfo();
        this.moduleConfigurations = jsonObject.moduleConfigurations.map((moduleConfiguration: any) => {
            return new ModuleConfiguration().fromJsonObject(moduleConfiguration, serialisationInfo);
        });
        this.macros = jsonObject.macros.map((macroJsonObject: any, index: number) => {
            const macro = new Macro().fromJsonObject(macroJsonObject, serialisationInfo);
            macro.id = index;
            return macro;
        });
        this.keymaps = jsonObject.keymaps.map((keymap: any) => {
            return new Keymap().fromJsonObject(keymap, this.macros, serialisationInfo);
        });
    }

    private fromJsonObjectV6(jsonObject: any): void {
        this.deviceName = jsonObject.deviceName;
        this.setDefaultDeviceName();
        this.doubleTapSwitchLayerTimeout = jsonObject.doubleTapSwitchLayerTimeout;
        this.iconsAndLayerTextsBrightness = jsonObject.iconsAndLayerTextsBrightness;
        this.alphanumericSegmentsBrightness = jsonObject.alphanumericSegmentsBrightness;
        this.keyBacklightBrightness = jsonObject.keyBacklightBrightness;
        this.ledsFadeTimeout = jsonObject.ledsFadeTimeout;
        this.perKeyRgbPresent = jsonObject.perKeyRgbPresent;
        this.backlightingMode = jsonObject.backlightingMode;
        this.backlightingNoneActionColor = new RgbColor().fromJsonObject(jsonObject.backlightingNoneActionColor, this.userConfigMajorVersion);
        this.backlightingScancodeColor = new RgbColor().fromJsonObject(jsonObject.backlightingScancodeColor, this.userConfigMajorVersion);
        this.backlightingModifierColor = new RgbColor().fromJsonObject(jsonObject.backlightingModifierColor, this.userConfigMajorVersion);
        this.backlightingShortcutColor = new RgbColor().fromJsonObject(jsonObject.backlightingShortcutColor, this.userConfigMajorVersion);
        this.backlightingSwitchLayerColor = new RgbColor().fromJsonObject(jsonObject.backlightingSwitchLayerColor, this.userConfigMajorVersion);
        this.backlightingSwitchKeymapColor = new RgbColor().fromJsonObject(jsonObject.backlightingSwitchKeymapColor, this.userConfigMajorVersion);
        this.backlightingMouseColor = new RgbColor().fromJsonObject(jsonObject.backlightingMouseColor, this.userConfigMajorVersion);
        this.backlightingMacroColor = new RgbColor().fromJsonObject(jsonObject.backlightingMacroColor, this.userConfigMajorVersion);
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
        const serialisationInfo = this.getSerialisationInfo();
        this.moduleConfigurations = jsonObject.moduleConfigurations.map((moduleConfiguration: any) => {
            return new ModuleConfiguration().fromJsonObject(moduleConfiguration, serialisationInfo);
        });
        this.macros = jsonObject.macros.map((macroJsonObject: any, index: number) => {
            const macro = new Macro().fromJsonObject(macroJsonObject, serialisationInfo);
            macro.id = index;
            return macro;
        });
        this.keymaps = jsonObject.keymaps.map((keymap: any) => {
            return new Keymap().fromJsonObject(keymap, this.macros, serialisationInfo);
        });
    }

    private fromJsonObjectV7(jsonObject: any): void {
        this.deviceName = jsonObject.deviceName;
        this.setDefaultDeviceName();
        this.doubleTapSwitchLayerTimeout = jsonObject.doubleTapSwitchLayerTimeout;
        this.iconsAndLayerTextsBrightness = jsonObject.iconsAndLayerTextsBrightness;
        this.alphanumericSegmentsBrightness = jsonObject.alphanumericSegmentsBrightness;
        this.keyBacklightBrightness = jsonObject.keyBacklightBrightness;
        this.ledsFadeTimeout = jsonObject.ledsFadeTimeout;
        this.perKeyRgbPresent = jsonObject.perKeyRgbPresent;
        this.backlightingMode = BacklightingMode[jsonObject.backlightingMode as string];
        this.backlightingNoneActionColor = new RgbColor().fromJsonObject(jsonObject.backlightingNoneActionColor, this.userConfigMajorVersion);
        this.backlightingScancodeColor = new RgbColor().fromJsonObject(jsonObject.backlightingScancodeColor, this.userConfigMajorVersion);
        this.backlightingModifierColor = new RgbColor().fromJsonObject(jsonObject.backlightingModifierColor, this.userConfigMajorVersion);
        this.backlightingShortcutColor = new RgbColor().fromJsonObject(jsonObject.backlightingShortcutColor, this.userConfigMajorVersion);
        this.backlightingSwitchLayerColor = new RgbColor().fromJsonObject(jsonObject.backlightingSwitchLayerColor, this.userConfigMajorVersion);
        this.backlightingSwitchKeymapColor = new RgbColor().fromJsonObject(jsonObject.backlightingSwitchKeymapColor, this.userConfigMajorVersion);
        this.backlightingMouseColor = new RgbColor().fromJsonObject(jsonObject.backlightingMouseColor, this.userConfigMajorVersion);
        this.backlightingMacroColor = new RgbColor().fromJsonObject(jsonObject.backlightingMacroColor, this.userConfigMajorVersion);
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

        this.secondaryRoleStrategy = SecondaryRoleStrategy[jsonObject.secondaryRoleStrategy as string];
        this.secondaryRoleAdvancedStrategyDoubletapTimeout = jsonObject.secondaryRoleAdvancedStrategyDoubletapTimeout;
        this.secondaryRoleAdvancedStrategyTimeout = jsonObject.secondaryRoleAdvancedStrategyTimeout;
        this.secondaryRoleAdvancedStrategySafetyMargin = jsonObject.secondaryRoleAdvancedStrategySafetyMargin;
        this.secondaryRoleAdvancedStrategyTriggerByRelease = jsonObject.secondaryRoleAdvancedStrategyTriggerByRelease;
        this.secondaryRoleAdvancedStrategyDoubletapToPrimary = jsonObject.secondaryRoleAdvancedStrategyDoubletapToPrimary;
        this.secondaryRoleAdvancedStrategyTimeoutAction = SecondaryRoleAdvancedStrategyTimeoutAction[jsonObject.secondaryRoleAdvancedStrategyTimeoutAction as string];
        this.mouseScrollAxisSkew = jsonObject.mouseScrollAxisSkew;
        this.mouseMoveAxisSkew = jsonObject.mouseMoveAxisSkew;
        this.diagonalSpeedCompensation = jsonObject.diagonalSpeedCompensation;
        this.doubletapTimeout = jsonObject.doubletapTimeout;
        this.keystrokeDelay = jsonObject.keystrokeDelay;

        const serialisationInfo = this.getSerialisationInfo();
        this.moduleConfigurations = jsonObject.moduleConfigurations.map((moduleConfiguration: any) => {
            return new ModuleConfiguration().fromJsonObject(moduleConfiguration, serialisationInfo);
        });
        this.macros = jsonObject.macros.map((macroJsonObject: any, index: number) => {
            const macro = new Macro().fromJsonObject(macroJsonObject, serialisationInfo);
            macro.id = index;
            return macro;
        });
        this.keymaps = jsonObject.keymaps.map((keymap: any) => {
            return new Keymap().fromJsonObject(keymap, this.macros, serialisationInfo);
        });
    }

    private migrateToV5(): boolean {
        if (this.userConfigMajorVersion > 4) {
            return false;
        }

        this.userConfigMajorVersion = 5;
        for (const keymap of this.keymaps) {
            for (let i = 0; i < keymap.layers.length; i++ ) {
                keymap.layers[i].id = i === 0 ? LayerName.base : i - 1;
            }
        }

        return true;
    }

    private migrateToV6(): boolean {
        if (this.userConfigMajorVersion > 5) {
            return false;
        }

        this.userConfigMajorVersion = 6;
        this.ledsFadeTimeout = 0;
        this.perKeyRgbPresent = false;
        this.backlightingMode = BacklightingMode.FunctionalBacklighting;
        this.backlightingNoneActionColor = new RgbColor({r:0, g:0, b:0});
        this.backlightingScancodeColor = new RgbColor({r:255, g:255, b:255});
        this.backlightingModifierColor = new RgbColor({r:0, g:255, b:255});
        this.backlightingShortcutColor = new RgbColor({r:0, g:0, b:255});
        this.backlightingSwitchLayerColor = new RgbColor({r:255, g:255, b:0});
        this.backlightingSwitchKeymapColor = new RgbColor({r:255, g:0, b:0});
        this.backlightingMouseColor = new RgbColor({r:0, g:255, b:0});
        this.backlightingMacroColor = new RgbColor({r:255, g:0, b:255});

        return true;
    }

    private migrateToV7(): boolean {
        if (this.userConfigMajorVersion > 6) {
            return false;
        }

        this.userConfigMajorVersion = 7;
        this.secondaryRoleStrategy = SecondaryRoleStrategy.Simple;
        this.secondaryRoleAdvancedStrategyDoubletapTimeout = 200;
        this.secondaryRoleAdvancedStrategyTimeoutAction = SecondaryRoleAdvancedStrategyTimeoutAction.Secondary;
        this.secondaryRoleAdvancedStrategyTimeout = 350;
        this.secondaryRoleAdvancedStrategySafetyMargin = 50;
        this.secondaryRoleAdvancedStrategyTriggerByRelease = true;
        this.secondaryRoleAdvancedStrategyDoubletapToPrimary = true;
        this.mouseScrollAxisSkew = 1;
        this.mouseMoveAxisSkew = 1;
        this.diagonalSpeedCompensation = false;
        this.doubletapTimeout = 400;
        this.keystrokeDelay = 0;

        this.moduleConfigurations.push(
            defaultKeyClusterLeftModuleConfig(),
            defaultTouchpadRightModuleConfig(),
            defaultTrackballRightModuleConfig(),
            defaultTrackpointRightModuleConfig(),
        );

        return true;
    }

    private getSerialisationInfo(): SerialisationInfo {
        return {
            isUserConfigContainsRgbColors: this.perKeyRgbPresent,
            userConfigMajorVersion: this.userConfigMajorVersion
        };
    }
}
