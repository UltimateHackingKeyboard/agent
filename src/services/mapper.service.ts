/* tslint:disable:variable-name */
const __svg__ = { path: '../../images/icons/**/*.svg', name: 'assets/compiled_sprite.svg' };
/* tslint:enable:variable-name */

import { Injectable } from '@angular/core';

@Injectable()
export class MapperService {

    private scanCodeTextMap: Map<number, string[]>;

    private scanCodeFileName: Map<number, string>;
    private nameToFileName: Map<string, string>;

    constructor() {
        this.initScanCodeTextMap();
        this.initScanCodeFileName();
        this.initNameToFileNames();
    }

    public scanCodeToText(scanCode: number): string[] {
        return this.scanCodeTextMap.get(scanCode);
    }

    public hasScancodeIcon(scancode: number): boolean {
        return this.scanCodeFileName.has(scancode);
    }

    public scanCodeToSvgImagePath(scanCode: number): string {
        let fileName: string = this.scanCodeFileName.get(scanCode);
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
        this.scanCodeTextMap = new Map<number, string[]>();
        this.scanCodeTextMap.set(4, ['A']);
        this.scanCodeTextMap.set(5, ['B']);
        this.scanCodeTextMap.set(6, ['C']);
        this.scanCodeTextMap.set(7, ['D']);
        this.scanCodeTextMap.set(8, ['E']);
        this.scanCodeTextMap.set(9, ['F']);
        this.scanCodeTextMap.set(10, ['G']);
        this.scanCodeTextMap.set(11, ['H']);
        this.scanCodeTextMap.set(12, ['I']);
        this.scanCodeTextMap.set(13, ['J']);
        this.scanCodeTextMap.set(14, ['K']);
        this.scanCodeTextMap.set(15, ['L']);
        this.scanCodeTextMap.set(16, ['M']);
        this.scanCodeTextMap.set(17, ['N']);
        this.scanCodeTextMap.set(18, ['O']);
        this.scanCodeTextMap.set(19, ['P']);
        this.scanCodeTextMap.set(20, ['Q']);
        this.scanCodeTextMap.set(21, ['R']);
        this.scanCodeTextMap.set(22, ['S']);
        this.scanCodeTextMap.set(23, ['T']);
        this.scanCodeTextMap.set(24, ['U']);
        this.scanCodeTextMap.set(25, ['V']);
        this.scanCodeTextMap.set(26, ['W']);
        this.scanCodeTextMap.set(27, ['X']);
        this.scanCodeTextMap.set(28, ['Y']);
        this.scanCodeTextMap.set(29, ['Z']);
        this.scanCodeTextMap.set(30, ['1', '!']);
        this.scanCodeTextMap.set(31, ['2', '@']);
        this.scanCodeTextMap.set(32, ['3', '#']);
        this.scanCodeTextMap.set(33, ['4', '$']);
        this.scanCodeTextMap.set(34, ['5', '%']);
        this.scanCodeTextMap.set(35, ['6', '^']);
        this.scanCodeTextMap.set(36, ['7', '&']);
        this.scanCodeTextMap.set(37, ['8', '*']);
        this.scanCodeTextMap.set(38, ['9', '(']);
        this.scanCodeTextMap.set(39, ['0', ')']);
        this.scanCodeTextMap.set(40, ['Enter']);
        this.scanCodeTextMap.set(41, ['Esc']);
        this.scanCodeTextMap.set(42, ['Backspace']);
        this.scanCodeTextMap.set(43, ['Tab']);
        this.scanCodeTextMap.set(44, ['Space']);
        this.scanCodeTextMap.set(45, ['-', '_']);
        this.scanCodeTextMap.set(46, ['=', '+']);
        this.scanCodeTextMap.set(47, ['[', '{']);
        this.scanCodeTextMap.set(48, [']', '}']);
        this.scanCodeTextMap.set(49, ['\\', '|']);
        this.scanCodeTextMap.set(50, ['NON_US_HASHMARK_AND_TILDE']);
        this.scanCodeTextMap.set(51, [';', ':']);
        this.scanCodeTextMap.set(52, ['\'', '"']);
        this.scanCodeTextMap.set(53, ['`', '~']);
        this.scanCodeTextMap.set(54, [',', '<']);
        this.scanCodeTextMap.set(55, ['.', '>']);
        this.scanCodeTextMap.set(56, ['/', '?']);
        this.scanCodeTextMap.set(57, ['Caps Lock']);
        this.scanCodeTextMap.set(58, ['F1']);
        this.scanCodeTextMap.set(59, ['F2']);
        this.scanCodeTextMap.set(60, ['F3']);
        this.scanCodeTextMap.set(61, ['F4']);
        this.scanCodeTextMap.set(62, ['F5']);
        this.scanCodeTextMap.set(63, ['F6']);
        this.scanCodeTextMap.set(64, ['F7']);
        this.scanCodeTextMap.set(65, ['F8']);
        this.scanCodeTextMap.set(66, ['F9']);
        this.scanCodeTextMap.set(67, ['F10']);
        this.scanCodeTextMap.set(68, ['F11']);
        this.scanCodeTextMap.set(69, ['F12']);
        this.scanCodeTextMap.set(70, ['PrtScn']);
        this.scanCodeTextMap.set(71, ['Scroll Lock']);
        this.scanCodeTextMap.set(72, ['Pause']);
        this.scanCodeTextMap.set(73, ['Insert']);
        this.scanCodeTextMap.set(74, ['Home']);
        this.scanCodeTextMap.set(75, ['PgUp']);
        this.scanCodeTextMap.set(76, ['Del']);
        this.scanCodeTextMap.set(77, ['End']);
        this.scanCodeTextMap.set(78, ['PgDn']);
        this.scanCodeTextMap.set(79, ['Right Arrow']);
        this.scanCodeTextMap.set(80, ['Left Arrow']);
        this.scanCodeTextMap.set(81, ['Down Arrow']);
        this.scanCodeTextMap.set(82, ['Up Arrow']);
        this.scanCodeTextMap.set(83, ['Num Lock']);
        this.scanCodeTextMap.set(84, ['/']);
        this.scanCodeTextMap.set(85, ['*']);
        this.scanCodeTextMap.set(86, ['-']);
        this.scanCodeTextMap.set(87, ['+']);
        this.scanCodeTextMap.set(88, ['Enter']);
        this.scanCodeTextMap.set(89, ['end', '1']);
        this.scanCodeTextMap.set(90, ['2']);
        this.scanCodeTextMap.set(91, ['pgdn', '3']);
        this.scanCodeTextMap.set(92, ['4']);
        this.scanCodeTextMap.set(93, ['5']);
        this.scanCodeTextMap.set(94, ['6']);
        this.scanCodeTextMap.set(95, ['home', '7']);
        this.scanCodeTextMap.set(96, ['8']);
        this.scanCodeTextMap.set(97, ['pgup', '9']);
        this.scanCodeTextMap.set(98, ['Insert', '0']);
        this.scanCodeTextMap.set(99, ['Del', '.']);
        this.scanCodeTextMap.set(104, ['F13']);
        this.scanCodeTextMap.set(105, ['F14']);
        this.scanCodeTextMap.set(106, ['F15']);
        this.scanCodeTextMap.set(107, ['F16']);
        this.scanCodeTextMap.set(108, ['F17']);
        this.scanCodeTextMap.set(109, ['F18']);
        this.scanCodeTextMap.set(110, ['F19']);
        this.scanCodeTextMap.set(111, ['F20']);
        this.scanCodeTextMap.set(112, ['F21']);
        this.scanCodeTextMap.set(113, ['F22']);
        this.scanCodeTextMap.set(114, ['F23']);
        this.scanCodeTextMap.set(115, ['F24']);
        this.scanCodeTextMap.set(118, ['Menu']);
        this.scanCodeTextMap.set(176, ['00']);
        this.scanCodeTextMap.set(177, ['000']);
        this.scanCodeTextMap.set(232, ['Play']);
        this.scanCodeTextMap.set(233, ['Stop']);
        this.scanCodeTextMap.set(234, ['Prev']);
        this.scanCodeTextMap.set(235, ['Next']);
        this.scanCodeTextMap.set(236, ['Eject']);
        this.scanCodeTextMap.set(237, ['Vol +']);
        this.scanCodeTextMap.set(238, ['Vol -']);
        this.scanCodeTextMap.set(239, ['Mute']);
        this.scanCodeTextMap.set(240, ['WWW']);
        this.scanCodeTextMap.set(241, ['Bckwrd']);
        this.scanCodeTextMap.set(242, ['Frwrd']);
        this.scanCodeTextMap.set(243, ['Cancel']);
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
