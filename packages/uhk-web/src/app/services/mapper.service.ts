import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { KeyModifiers, KeystrokeType, SecondaryRoleAction } from 'uhk-common';
import { Subscription } from 'rxjs';

import { AppState, getOperatingSystem } from '../store';
import { OperatingSystem } from '../models/operating-system';
import { KeyModifierModel } from '../models/key-modifier-model';

export enum OsSpecificKeys {
    Enter = 'Enter',
}

export type OsSpecificTexts = OsSpecificKeys | KeyModifiers;

@Injectable()
export class MapperService implements OnDestroy {

    private basicScanCodeTextMap: Map<number, string[]>;
    private mediaScanCodeTextMap: Map<number, string[]>;
    private systemScanCodeTextMap: Map<number, string[]>;

    private basicScancodeIcons: Map<number, string>;
    private mediaScancodeIcons: Map<number, string>;
    private systemScancodeIcons: Map<number, string>;
    private nameToFileName: Map<string, string>;
    private osSpecificTexts: Map<OsSpecificTexts, string>;
    private secondaryRoleTexts: Map<number, string>;

    private operatingSystem: OperatingSystem;
    private osSubscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.osSubscription = store
            .select(getOperatingSystem)
            .subscribe(os => {
                this.operatingSystem = os;
                this.initOsSpecificText();
                this.initScanCodeTextMap();
                this.initScancodeIcons();
                this.initNameToFileNames();
                this.initSecondaryRoleTexts();
            });
    }

    ngOnDestroy(): void {
        this.osSubscription.unsubscribe();
    }

    public scanCodeToText(scanCode: number, type: KeystrokeType = KeystrokeType.basic): string[] {
        let map: Map<number, string[]>;
        let prefix: string;

        switch (type) {
            case KeystrokeType.shortMedia:
            case KeystrokeType.longMedia:
                map = this.mediaScanCodeTextMap;
                prefix = 'M';
                break;
            case KeystrokeType.system:
                map = this.systemScanCodeTextMap;
                prefix = 'S';
                break;
            default:
                map = this.basicScanCodeTextMap;
                prefix = 'B';
                break;
        }

        return map.get(scanCode) || [`${prefix}${scanCode}`];
    }

    public hasScancodeIcon(scancode: number, type = KeystrokeType.basic): boolean {
        let map: Map<number, string>;
        switch (type) {
            case KeystrokeType.basic:
                map = this.basicScancodeIcons;
                break;
            case KeystrokeType.shortMedia:
            case KeystrokeType.longMedia:
                map = this.mediaScancodeIcons;
                break;
            case KeystrokeType.system:
                map = this.systemScancodeIcons;
                break;
            default:
                map = new Map<number, string>();
        }
        return map.has(scancode);
    }

    public scanCodeToSvgImagePath(scanCode: number, type = KeystrokeType.basic): string {
        let map: Map<number, string>;
        switch (type) {
            case KeystrokeType.basic:
                map = this.basicScancodeIcons;
                break;
            case KeystrokeType.shortMedia:
            case KeystrokeType.longMedia:
                map = this.mediaScancodeIcons;
                break;
            case KeystrokeType.system:
                map = this.systemScancodeIcons;
                break;
            default:
                return undefined;
        }
        const id = map.get(scanCode);
        if (!id) {
            return undefined;
        }
        return `assets/compiled_sprite.svg#${id}`;
    }

    public getIcon(iconName: string): string {
        const mappedIconName = this.nameToFileName.get(iconName);
        if (mappedIconName) {
            return 'assets/compiled_sprite.svg#' + mappedIconName;
        }
    }

    public getOperatingSystem(): OperatingSystem {
        return this.operatingSystem;
    }

    public getOsSpecificText(key: OsSpecificTexts): string {
        const text = this.osSpecificTexts.get(key);

        return text ? text : key.toString();
    }

    public getSecondaryRoleText(secondaryRoleAction: SecondaryRoleAction): string {
        return this.secondaryRoleTexts.get(secondaryRoleAction);
    }

    public getLeftKeyModifiers(): KeyModifierModel[] {
        return [
            {
                text: this.getOsSpecificText(KeyModifiers.leftShift),
                value: KeyModifiers.leftShift,
                checked: false
            },
            {
                text: this.getOsSpecificText(KeyModifiers.leftCtrl),
                value: KeyModifiers.leftCtrl,
                checked: false
            },
            {
                text: this.getOsSpecificText(KeyModifiers.leftAlt),
                value: KeyModifiers.leftAlt,
                checked: false
            },
            {
                text: this.getOsSpecificText(KeyModifiers.leftGui),
                value: KeyModifiers.leftGui,
                checked: false
            }
        ];
    }

    public getRightKeyModifiers(): KeyModifierModel[] {
        return [
            {
                text: this.getOsSpecificText(KeyModifiers.rightShift),
                value: KeyModifiers.rightShift,
                checked: false
            },
            {
                text: this.getOsSpecificText(KeyModifiers.rightCtrl),
                value: KeyModifiers.rightCtrl,
                checked: false
            },
            {
                text: this.getOsSpecificText(KeyModifiers.rightAlt),
                value: KeyModifiers.rightAlt,
                checked: false
            },
            {
                text: this.getOsSpecificText(KeyModifiers.rightGui),
                value: KeyModifiers.rightGui,
                checked: false
            }
        ];
    }

    private initOsSpecificText(): void {
        this.osSpecificTexts = new Map<KeyModifiers, string>();
        this.osSpecificTexts.set(KeyModifiers.leftShift, 'LShift');
        this.osSpecificTexts.set(KeyModifiers.leftCtrl, 'LCtrl');
        this.osSpecificTexts.set(KeyModifiers.leftAlt, 'LAlt');
        this.osSpecificTexts.set(KeyModifiers.leftGui, 'LSuper');

        this.osSpecificTexts.set(KeyModifiers.rightShift, 'RShift');
        this.osSpecificTexts.set(KeyModifiers.rightCtrl, 'RCtrl');
        this.osSpecificTexts.set(KeyModifiers.rightAlt, 'RAlt(Gr)');
        this.osSpecificTexts.set(KeyModifiers.rightGui, 'RSuper');

        this.osSpecificTexts.set(OsSpecificKeys.Enter, 'Enter');

        if (this.operatingSystem === OperatingSystem.Mac) {
            this.osSpecificTexts.set(OsSpecificKeys.Enter, 'Return');
            this.osSpecificTexts.set(KeyModifiers.leftGui, 'LCmd');
            this.osSpecificTexts.set(KeyModifiers.rightGui, 'RCmd');
            this.osSpecificTexts.set(KeyModifiers.leftAlt, 'LOption');
            this.osSpecificTexts.set(KeyModifiers.rightAlt, 'ROption');
        } else if (this.operatingSystem === OperatingSystem.Windows) {
            this.osSpecificTexts.set(KeyModifiers.leftGui, 'LWin');
            this.osSpecificTexts.set(KeyModifiers.rightGui, 'RWin');
        }
    }

    // TODO: read the mapping from JSON
    private initScanCodeTextMap(): void {
        this.basicScanCodeTextMap = new Map<number, string[]>();
        this.basicScanCodeTextMap.set(4, ['A']);
        this.basicScanCodeTextMap.set(5, ['B']);
        this.basicScanCodeTextMap.set(6, ['C']);
        this.basicScanCodeTextMap.set(7, ['D']);
        this.basicScanCodeTextMap.set(8, ['E']);
        this.basicScanCodeTextMap.set(9, ['F']);
        this.basicScanCodeTextMap.set(10, ['G']);
        this.basicScanCodeTextMap.set(11, ['H']);
        this.basicScanCodeTextMap.set(12, ['I']);
        this.basicScanCodeTextMap.set(13, ['J']);
        this.basicScanCodeTextMap.set(14, ['K']);
        this.basicScanCodeTextMap.set(15, ['L']);
        this.basicScanCodeTextMap.set(16, ['M']);
        this.basicScanCodeTextMap.set(17, ['N']);
        this.basicScanCodeTextMap.set(18, ['O']);
        this.basicScanCodeTextMap.set(19, ['P']);
        this.basicScanCodeTextMap.set(20, ['Q']);
        this.basicScanCodeTextMap.set(21, ['R']);
        this.basicScanCodeTextMap.set(22, ['S']);
        this.basicScanCodeTextMap.set(23, ['T']);
        this.basicScanCodeTextMap.set(24, ['U']);
        this.basicScanCodeTextMap.set(25, ['V']);
        this.basicScanCodeTextMap.set(26, ['W']);
        this.basicScanCodeTextMap.set(27, ['X']);
        this.basicScanCodeTextMap.set(28, ['Y']);
        this.basicScanCodeTextMap.set(29, ['Z']);
        this.basicScanCodeTextMap.set(30, ['1', '!']);
        this.basicScanCodeTextMap.set(31, ['2', '@']);
        this.basicScanCodeTextMap.set(32, ['3', '#']);
        this.basicScanCodeTextMap.set(33, ['4', '$']);
        this.basicScanCodeTextMap.set(34, ['5', '%']);
        this.basicScanCodeTextMap.set(35, ['6', '^']);
        this.basicScanCodeTextMap.set(36, ['7', '&']);
        this.basicScanCodeTextMap.set(37, ['8', '*']);
        this.basicScanCodeTextMap.set(38, ['9', '(']);
        this.basicScanCodeTextMap.set(39, ['0', ')']);
        this.basicScanCodeTextMap.set(40, [this.getOsSpecificText(OsSpecificKeys.Enter)]);
        this.basicScanCodeTextMap.set(41, ['Esc']);
        this.basicScanCodeTextMap.set(42, ['Backspace']);
        this.basicScanCodeTextMap.set(43, ['Tab']);
        this.basicScanCodeTextMap.set(44, ['Space']);
        this.basicScanCodeTextMap.set(45, ['-', '_']);
        this.basicScanCodeTextMap.set(46, ['=', '+']);
        this.basicScanCodeTextMap.set(47, ['[', '{']);
        this.basicScanCodeTextMap.set(48, [']', '}']);
        this.basicScanCodeTextMap.set(49, ['\\', '|']);
        this.basicScanCodeTextMap.set(50, ['NON_US_HASHMARK_AND_TILDE']);
        this.basicScanCodeTextMap.set(51, [';', ':']);
        this.basicScanCodeTextMap.set(52, ['\'', '"']);
        this.basicScanCodeTextMap.set(53, ['`', '~']);
        this.basicScanCodeTextMap.set(54, [',', '<']);
        this.basicScanCodeTextMap.set(55, ['.', '>']);
        this.basicScanCodeTextMap.set(56, ['/', '?']);
        this.basicScanCodeTextMap.set(57, ['Caps Lock']);
        this.basicScanCodeTextMap.set(58, ['F1']);
        this.basicScanCodeTextMap.set(59, ['F2']);
        this.basicScanCodeTextMap.set(60, ['F3']);
        this.basicScanCodeTextMap.set(61, ['F4']);
        this.basicScanCodeTextMap.set(62, ['F5']);
        this.basicScanCodeTextMap.set(63, ['F6']);
        this.basicScanCodeTextMap.set(64, ['F7']);
        this.basicScanCodeTextMap.set(65, ['F8']);
        this.basicScanCodeTextMap.set(66, ['F9']);
        this.basicScanCodeTextMap.set(67, ['F10']);
        this.basicScanCodeTextMap.set(68, ['F11']);
        this.basicScanCodeTextMap.set(69, ['F12']);
        this.basicScanCodeTextMap.set(70, ['PrtScn', 'SysRq']);
        this.basicScanCodeTextMap.set(71, ['ScrLk']);
        this.basicScanCodeTextMap.set(72, ['Pause']);
        this.basicScanCodeTextMap.set(73, ['Insert']);
        this.basicScanCodeTextMap.set(74, ['Home']);
        this.basicScanCodeTextMap.set(75, ['PgUp']);
        this.basicScanCodeTextMap.set(76, ['Del']);
        this.basicScanCodeTextMap.set(77, ['End']);
        this.basicScanCodeTextMap.set(78, ['PgDn']);
        this.basicScanCodeTextMap.set(79, ['Right Arrow']);
        this.basicScanCodeTextMap.set(80, ['Left Arrow']);
        this.basicScanCodeTextMap.set(81, ['Down Arrow']);
        this.basicScanCodeTextMap.set(82, ['Up Arrow']);
        this.basicScanCodeTextMap.set(83, ['NumLk']);
        this.basicScanCodeTextMap.set(84, ['Np /']);
        this.basicScanCodeTextMap.set(85, ['Np *']);
        this.basicScanCodeTextMap.set(86, ['Np -']);
        this.basicScanCodeTextMap.set(87, ['Np +']);
        this.basicScanCodeTextMap.set(88, [`Np ${this.getOsSpecificText(OsSpecificKeys.Enter)}`]);
        this.basicScanCodeTextMap.set(89, ['Np 1', 'End']);
        this.basicScanCodeTextMap.set(90, ['Np 2', 'icon-kbd__mod--arrow-down']);
        this.basicScanCodeTextMap.set(91, ['Np 3', 'PgDn']);
        this.basicScanCodeTextMap.set(92, ['Np 4', 'icon-kbd__mod--arrow-left']);
        this.basicScanCodeTextMap.set(93, ['Np 5']);
        this.basicScanCodeTextMap.set(94, ['Np 6', 'icon-kbd__mod--arrow-right']);
        this.basicScanCodeTextMap.set(95, ['Np 7', 'Home']);
        this.basicScanCodeTextMap.set(96, ['Np 8', 'icon-kbd__mod--arrow-up']);
        this.basicScanCodeTextMap.set(97, ['Np 9', 'PgUp']);
        this.basicScanCodeTextMap.set(98, ['Np 0', 'Insert']);
        this.basicScanCodeTextMap.set(99, ['Np .', 'Del']);
        this.basicScanCodeTextMap.set(100, ['ISO key', '|']);
        this.basicScanCodeTextMap.set(101, ['Menu']);
        this.basicScanCodeTextMap.set(104, ['F13']);
        this.basicScanCodeTextMap.set(105, ['F14']);
        this.basicScanCodeTextMap.set(106, ['F15']);
        this.basicScanCodeTextMap.set(107, ['F16']);
        this.basicScanCodeTextMap.set(108, ['F17']);
        this.basicScanCodeTextMap.set(109, ['F18']);
        this.basicScanCodeTextMap.set(110, ['F19']);
        this.basicScanCodeTextMap.set(111, ['F20']);
        this.basicScanCodeTextMap.set(112, ['F21']);
        this.basicScanCodeTextMap.set(113, ['F22']);
        this.basicScanCodeTextMap.set(114, ['F23']);
        this.basicScanCodeTextMap.set(115, ['F24']);
        this.basicScanCodeTextMap.set(135, ['Int1']);
        this.basicScanCodeTextMap.set(136, ['Int2']);
        this.basicScanCodeTextMap.set(137, ['Int3']);
        this.basicScanCodeTextMap.set(138, ['Int4']);
        this.basicScanCodeTextMap.set(139, ['Int5']);
        this.basicScanCodeTextMap.set(144, ['Lang1']);
        this.basicScanCodeTextMap.set(145, ['Lang2']);
        this.basicScanCodeTextMap.set(176, ['00']);
        this.basicScanCodeTextMap.set(177, ['000']);

        this.mediaScanCodeTextMap = new Map<number, string[]>();
        this.mediaScanCodeTextMap.set(176, ['Play']);
        this.mediaScanCodeTextMap.set(177, ['Pause']);
        this.mediaScanCodeTextMap.set(181, ['Next']);
        this.mediaScanCodeTextMap.set(182, ['Prev']);
        this.mediaScanCodeTextMap.set(183, ['Stop']);
        this.mediaScanCodeTextMap.set(184, ['Eject']);
        this.mediaScanCodeTextMap.set(205, ['Pause', 'Play']);
        this.mediaScanCodeTextMap.set(226, ['Mute']);
        this.mediaScanCodeTextMap.set(233, ['Vol +']);
        this.mediaScanCodeTextMap.set(234, ['Vol -']);

        this.mediaScanCodeTextMap.set(394, ['Launch Email Client']);
        this.mediaScanCodeTextMap.set(402, ['Launch Calculator']);

        this.mediaScanCodeTextMap.set(548, ['Hist -']);
        this.mediaScanCodeTextMap.set(549, ['Hist +']);

        this.systemScanCodeTextMap = new Map<number, string[]>();
        this.systemScanCodeTextMap.set(129, ['Power Down']);
        this.systemScanCodeTextMap.set(130, ['Sleep']);
        this.systemScanCodeTextMap.set(131, ['Wake Up']);
    }

    private initScancodeIcons(): void {
        this.basicScancodeIcons = new Map<number, string>();
        this.basicScancodeIcons.set(42, 'icon-kbd__backspace');
        this.basicScancodeIcons.set(57, 'icon-kbd__caps-lock');
        this.basicScancodeIcons.set(79, 'icon-kbd__mod--arrow-right');
        this.basicScancodeIcons.set(80, 'icon-kbd__mod--arrow-left');
        this.basicScancodeIcons.set(81, 'icon-kbd__mod--arrow-down');
        this.basicScancodeIcons.set(82, 'icon-kbd__mod--arrow-up');
        this.basicScancodeIcons.set(101, 'icon-kbd__mod--menu');

        this.mediaScancodeIcons = new Map<number, string>();
        this.mediaScancodeIcons.set(111, 'icon-kbd__media--sunrise');
        this.mediaScancodeIcons.set(112, 'icon-kbd__media--sunset');
        this.mediaScancodeIcons.set(176, 'icon-kbd__media--play');
        this.mediaScancodeIcons.set(177, 'icon-kbd__media--pause');
        this.mediaScancodeIcons.set(181, 'icon-kbd__media--next');
        this.mediaScancodeIcons.set(182, 'icon-kbd__media--prev');
        this.mediaScancodeIcons.set(184, 'icon-kbd__fn--eject');
        this.mediaScancodeIcons.set(205, 'icon-kbd__play-pause');
        this.mediaScancodeIcons.set(226, 'icon-kbd__media--mute');
        this.mediaScancodeIcons.set(233, 'icon-kbd__media--vol-up');
        this.mediaScancodeIcons.set(234, 'icon-kbd__media--vol-down');

        this.mediaScancodeIcons.set(394, 'icon-kbd__media--email-client');
        this.mediaScancodeIcons.set(402, 'icon-kbd__media--calculator');

        this.systemScancodeIcons = new Map<number, string>();
        this.systemScancodeIcons.set(129, 'icon-kbd__system_power_down');
        this.systemScancodeIcons.set(130, 'icon-kbd__system_sleep');
        this.systemScancodeIcons.set(131, 'icon-kbd__system_wake_up');
    }

    private initNameToFileNames(): void {
        this.nameToFileName = new Map<string, string>();
        this.nameToFileName.set('toggle', 'icon-kbd__fn--toggle');
        this.nameToFileName.set('double-tap', 'icon-kbd__fn--double-tap');
        this.nameToFileName.set('switch-keymap', 'icon-kbd__mod--switch-keymap');
        this.nameToFileName.set('macro', 'icon-icon__macro');
        this.nameToFileName.set('shift', 'icon-kbd__default--modifier-shift');
        if (this.operatingSystem === OperatingSystem.Mac) {
            this.nameToFileName.set('option', 'icon-kbd__default--modifier-option');
            this.nameToFileName.set('command', 'icon-kbd__default--modifier-command');
        } else if (this.operatingSystem === OperatingSystem.Windows) {
            this.nameToFileName.set('command', 'icon-kbd__default--modifier-windows');
        }
        this.nameToFileName.set('mouse', 'icon-kbd__mouse');
        this.nameToFileName.set('left-arrow', 'icon-kbd__mod--arrow-left');
        this.nameToFileName.set('right-arrow', 'icon-kbd__mod--arrow-right');
        this.nameToFileName.set('down-arrow', 'icon-kbd__mod--arrow-down');
        this.nameToFileName.set('up-arrow', 'icon-kbd__mod--arrow-up');
        this.nameToFileName.set('icon-kbd__mod--arrow-left', 'icon-kbd__mod--arrow-left');
        this.nameToFileName.set('icon-kbd__mod--arrow-right', 'icon-kbd__mod--arrow-right');
        this.nameToFileName.set('icon-kbd__mod--arrow-down', 'icon-kbd__mod--arrow-down');
        this.nameToFileName.set('icon-kbd__mod--arrow-up', 'icon-kbd__mod--arrow-up');
        this.nameToFileName.set('scroll-left', 'icon-kbd__mouse--scroll-left');
        this.nameToFileName.set('scroll-right', 'icon-kbd__mouse--scroll-right');
        this.nameToFileName.set('scroll-down', 'icon-kbd__mouse--scroll-down');
        this.nameToFileName.set('scroll-up', 'icon-kbd__mouse--scroll-up');
    }

    private initSecondaryRoleTexts(): void {
        this.secondaryRoleTexts = new Map<number, string>();
        this.secondaryRoleTexts.set(SecondaryRoleAction.leftCtrl, this.getOsSpecificText(KeyModifiers.leftCtrl));
        this.secondaryRoleTexts.set(SecondaryRoleAction.leftShift, this.getOsSpecificText(KeyModifiers.leftShift));
        this.secondaryRoleTexts.set(SecondaryRoleAction.leftAlt, this.getOsSpecificText(KeyModifiers.leftAlt));
        this.secondaryRoleTexts.set(SecondaryRoleAction.leftSuper, this.getOsSpecificText(KeyModifiers.leftGui));
        this.secondaryRoleTexts.set(SecondaryRoleAction.rightCtrl, this.getOsSpecificText(KeyModifiers.rightCtrl));
        this.secondaryRoleTexts.set(SecondaryRoleAction.rightShift, this.getOsSpecificText(KeyModifiers.rightShift));
        this.secondaryRoleTexts.set(SecondaryRoleAction.rightAlt, this.getOsSpecificText(KeyModifiers.rightAlt));
        this.secondaryRoleTexts.set(SecondaryRoleAction.rightSuper, this.getOsSpecificText(KeyModifiers.rightGui));
        this.secondaryRoleTexts.set(SecondaryRoleAction.mod, 'Mod');
        this.secondaryRoleTexts.set(SecondaryRoleAction.fn, 'Fn');
        this.secondaryRoleTexts.set(SecondaryRoleAction.mouse, 'Mouse');
        this.secondaryRoleTexts.set(SecondaryRoleAction.fn2, 'Fn2');
        this.secondaryRoleTexts.set(SecondaryRoleAction.fn3, 'Fn3');
        this.secondaryRoleTexts.set(SecondaryRoleAction.fn4, 'Fn4');
        this.secondaryRoleTexts.set(SecondaryRoleAction.fn5, 'Fn5');
    }
}
