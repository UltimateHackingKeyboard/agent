/* tslint:disable:variable-name */
const __svg__ = { path: '../../../images/icons/**/*.svg', name: 'assets/compiled_sprite.svg' };
/* tslint:enable:variable-name */

import { Injectable } from '@angular/core';
import { KeystrokeType } from '../config-serializer/config-items/key-action/keystroke-type';

@Injectable()
export class MapperService {

    private basicScanCodeTextMap: Map<number, string[]>;
    private mediaScanCodeTextMap: Map<number, string[]>;

    private scanCodeFileName: Map<number, string>;
    private nameToFileName: Map<string, string>;

    constructor() {
        this.initScanCodeTextMap();
        this.initScanCodeFileName();
        this.initNameToFileNames();
    }

    public scanCodeToText(scanCode: number, type: KeystrokeType = KeystrokeType.basic): string[] {
        let map: Map<number, string[]>;
        switch (type) {
            case KeystrokeType.shortMedia:
            case KeystrokeType.longMedia:
                map = this.mediaScanCodeTextMap;
                break;
            default:
                map = this.basicScanCodeTextMap;
                break;
        }
        return map.get(scanCode);
    }

    public hasScancodeIcon(scancode: number): boolean {
        return this.scanCodeFileName.has(scancode);
    }

    public scanCodeToSvgImagePath(scanCode: number): string {
        const fileName: string = this.scanCodeFileName.get(scanCode);
        if (fileName) {
            return 'assets/compiled_sprite.svg#' + fileName;
        }
        return undefined;
    }

    public getIcon(iconName: string): string {
        return 'assets/compiled_sprite.svg#' + this.nameToFileName.get(iconName);
    }

    public modifierMapper(x: number) {
        if (x < 8) {
            return Math.floor(x / 2) * 4 + 1 - x; // 1, 0, 3, 2, 5, 4, 7, 6
        } else {
            return x;
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
        this.basicScanCodeTextMap.set(40, ['Enter']);
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
        this.basicScanCodeTextMap.set(70, ['PrtScn']);
        this.basicScanCodeTextMap.set(71, ['Scroll Lock']);
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
        this.basicScanCodeTextMap.set(83, ['Num Lock']);
        this.basicScanCodeTextMap.set(84, ['/']);
        this.basicScanCodeTextMap.set(85, ['*']);
        this.basicScanCodeTextMap.set(86, ['-']);
        this.basicScanCodeTextMap.set(87, ['+']);
        this.basicScanCodeTextMap.set(88, ['Enter']);
        this.basicScanCodeTextMap.set(89, ['end', '1']);
        this.basicScanCodeTextMap.set(90, ['2']);
        this.basicScanCodeTextMap.set(91, ['pgdn', '3']);
        this.basicScanCodeTextMap.set(92, ['4']);
        this.basicScanCodeTextMap.set(93, ['5']);
        this.basicScanCodeTextMap.set(94, ['6']);
        this.basicScanCodeTextMap.set(95, ['home', '7']);
        this.basicScanCodeTextMap.set(96, ['8']);
        this.basicScanCodeTextMap.set(97, ['pgup', '9']);
        this.basicScanCodeTextMap.set(98, ['Insert', '0']);
        this.basicScanCodeTextMap.set(99, ['Del', '.']);
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
        this.basicScanCodeTextMap.set(118, ['Menu']);
        this.basicScanCodeTextMap.set(176, ['00']);
        this.basicScanCodeTextMap.set(177, ['000']);

        this.mediaScanCodeTextMap = new Map<number, string[]>();
        this.mediaScanCodeTextMap.set(226, ['Mute']);
        this.mediaScanCodeTextMap.set(232, ['Play']);
        this.mediaScanCodeTextMap.set(233, ['Stop']);
        this.mediaScanCodeTextMap.set(234, ['Prev']);
        this.mediaScanCodeTextMap.set(235, ['Next']);
        this.mediaScanCodeTextMap.set(236, ['Eject']);
        this.mediaScanCodeTextMap.set(237, ['Vol +']);
        this.mediaScanCodeTextMap.set(238, ['Vol -']);
        this.mediaScanCodeTextMap.set(240, ['WWW']);
        this.mediaScanCodeTextMap.set(241, ['Bckwrd']);
        this.mediaScanCodeTextMap.set(242, ['Frwrd']);
        this.mediaScanCodeTextMap.set(243, ['Cancel']);
    }

    private initScanCodeFileName(): void {
        this.scanCodeFileName = new Map<number, string>();
        this.scanCodeFileName.set(79, 'icon-kbd__mod--arrow-right');
        this.scanCodeFileName.set(80, 'icon-kbd__mod--arrow-left');
        this.scanCodeFileName.set(81, 'icon-kbd__mod--arrow-down');
        this.scanCodeFileName.set(82, 'icon-kbd__mod--arrow-up');
        this.scanCodeFileName.set(118, 'icon-kbd__mod--menu');
    }

    private initNameToFileNames(): void {
        this.nameToFileName = new Map<string, string>();
        this.nameToFileName.set('toggle', 'icon-kbd__fn--toggle');
        this.nameToFileName.set('switch-keymap', 'icon-kbd__mod--switch-keymap');
        this.nameToFileName.set('macro', 'icon-icon__macro');
        this.nameToFileName.set('shift', 'icon-kbd__default--modifier-shift');
        this.nameToFileName.set('option', 'icon-kbd__default--modifier-option');
        this.nameToFileName.set('command', 'icon-kbd__default--modifier-command');
        this.nameToFileName.set('mouse', 'icon-kbd__mouse');
        this.nameToFileName.set('left-arrow', 'icon-kbd__mod--arrow-left');
        this.nameToFileName.set('right-arrow', 'icon-kbd__mod--arrow-right');
        this.nameToFileName.set('down-arrow', 'icon-kbd__mod--arrow-down');
        this.nameToFileName.set('up-arrow', 'icon-kbd__mod--arrow-up');
        this.nameToFileName.set('scroll-left', 'icon-kbd__mouse--scroll-left');
        this.nameToFileName.set('scroll-right', 'icon-kbd__mouse--scroll-right');
        this.nameToFileName.set('scroll-down', 'icon-kbd__mouse--scroll-down');
        this.nameToFileName.set('scroll-up', 'icon-kbd__mouse--scroll-up');
    }

}
