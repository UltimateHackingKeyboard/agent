import { Injectable } from '@angular/core';

@Injectable()
export class MapperService {

    private scanCodeTextMap = [
        [], // 0
        [], // 1
        [], // 2
        [], // 3
        ['A'], // 4
        ['B'], // 5
        ['C'], // 6
        ['D'], // 7
        ['E'], // 8
        ['F'], // 9
        ['G'], // 10
        ['H'], // 11
        ['I'], // 12
        ['J'], // 13
        ['K'], // 14
        ['L'], // 15
        ['M'], // 16
        ['N'], // 17
        ['O'], // 18
        ['P'], // 19
        ['Q'], // 20
        ['R'], // 21
        ['S'], // 22
        ['T'], // 23
        ['U'], // 24
        ['V'], // 25
        ['W'], // 26
        ['X'], // 27
        ['Y'], // 28
        ['Z'], // 29
        ['1', '!'], // 30
        ['2', '@'], // 31
        ['3', '#'], // 32
        ['4', '$'], // 33
        ['5', '%'], // 34
        ['6', '^'], // 35
        ['7', '&'], // 36
        ['8', '*'], // 37
        ['9', '('], // 38
        ['0', ')'], // 39
        ['Enter'], // 40 - Enter
        ['Esc'], // 41 - Escape
        ['←'], // 42 - Backspace
        ['Tab'], // 43 - Tab
        ['Space'], // 44 - Space
        ['-', '_'], // 45
        ['=', '+'], // 46
        ['[', '{'], // 47
        [']', '}'], // 48
        ['\\', '|'], // 49
        [], // 50 NON_US_HASHMARK_AND_TILDE
        [';', ':'], // 51
        ['\'', '"'], // 52
        ['`', '~'], // 53
        [',', '<'], // 54
        ['.', '>'], // 55
        ['/', '?'], // 56
        ['Caps Lock'], // 57
        ['F1'], // 58
        ['F2'], // 59
        ['F3'], // 60
        ['F4'], // 61
        ['F5'], // 62
        ['F6'], // 63
        ['F7'], // 64
        ['F8'], // 65
        ['F9'], // 66
        ['F10'], // 67
        ['F11'], // 68
        ['F12'], // 69
        ['PrtScn'], // 70 - Print Screen
        ['Scroll Lock'], // 71
        ['Pause'], // 72
        ['Insert'], // 73
        ['Home'], // 74
        ['PgUp'], // 75
        ['Del'], // 76
        ['End'], // 77
        ['PgDn'], // 78
        undefined, // 79 Right arrow
        undefined, // 80 Left arrow
        undefined, // 81 Down arrow
        undefined // 82 Up arrow
    ];

    private scanCodeFileName: Map<number, string>;
    private nameToFileName: Map<string, string>;

    constructor() {
        this.initScanCodeTextMap();
        this.initScanCodeFileName();
        this.initNameToFileNames();
    }

    public scanCodeToText(scanCode: number): string[] {
        return this.scanCodeTextMap[scanCode] || [ 'Unkown' ];
    }

    public scanCodeToSvgImagePath(scanCode: number): string {
        let fileName: string = this.scanCodeFileName[scanCode];
        if (fileName) {
            return 'assets/compiled_sprite.svg#' + fileName;
        }
        return undefined;
    }

    public getIcon(iconName: string): string {
        return 'assets/compiled_sprite.svg#' + this.nameToFileName.get(iconName);
    }

    private initScanCodeTextMap(): void {
        this.scanCodeTextMap[232] = ['Play'];
        this.scanCodeTextMap[233] = ['Stop'];
        this.scanCodeTextMap[234] = ['Prev'];
        this.scanCodeTextMap[235] = ['Next'];
        this.scanCodeTextMap[236] = ['Eject'];
        this.scanCodeTextMap[237] = ['Vol +'];
        this.scanCodeTextMap[238] = ['Vol -'];
        this.scanCodeTextMap[239] = ['Mute'];
        this.scanCodeTextMap[240] = ['WWW'];
        this.scanCodeTextMap[241] = ['Bckwrd'];
        this.scanCodeTextMap[242] = ['Frwrd'];
        this.scanCodeTextMap[243] = ['Cancel'];
    }

    private initScanCodeFileName(): void {
        this.scanCodeFileName = new Map<number, string>();
        this.scanCodeFileName[79] = 'icon-kbd__mod--arrow-right';
        this.scanCodeFileName[80] = 'icon-kbd__mod--arrow-left';
        this.scanCodeFileName[81] = 'icon-kbd__mod--arrow-down';
        this.scanCodeFileName[82] = 'icon-kbd__mod--arrow-up';
        this.scanCodeFileName[118] = 'icon-kbd__mod--menu';
    }

    private initNameToFileNames(): void {
        this.nameToFileName = new Map<string, string>();
        this.nameToFileName.set('toggle', 'icon-kbd__fn--toggle');
        this.nameToFileName.set('switch-keymap', 'icon-kbd__mod--switch-keymap');
        this.nameToFileName.set('macro', 'icon-icon__macro');
        this.nameToFileName.set('shift', 'icon-kbd__default--modifier-shift');
        this.nameToFileName.set('option', 'icon-kbd__default--modifier-option');
        this.nameToFileName.set('command', 'icon-kbd__default--modifier-command');
    }

}
