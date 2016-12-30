import { Injectable } from '@angular/core';

@Injectable()
export class CaptureService {
    private mapping: Map<number, number>;
    private leftModifiers: Map<number, boolean>;
    private rightModifiers: Map<number, boolean>;

    constructor() {
        this.leftModifiers = new Map<number, boolean>();
        this.rightModifiers = new Map<number, boolean>();
        this.mapping = new Map<number, number>();
    }

    public getMap(code: number) {
        return this.mapping.get(code);
    }

    public hasMap(code: number) {
        return this.mapping.has(code);
    }

    public setModifier(left: boolean, code: number) {
        return left ? this.leftModifiers.set(code, true) : this.rightModifiers.set(code, true);
    }

    public getModifiers(left: boolean) {
        return left ? this.reMap(this.leftModifiers) : this.reMap(this.rightModifiers);
    }

    public initModifiers() {
        this.leftModifiers.set(16, false); // Shift
        this.leftModifiers.set(17, false); // Ctrl
        this.leftModifiers.set(18, false); // Alt
        this.leftModifiers.set(91, false); // Super

        this.rightModifiers.set(16, false); // Shift
        this.rightModifiers.set(17, false); // Ctrl
        this.rightModifiers.set(18, false); // Alt
        this.rightModifiers.set(91, false); // Super
    }

    public populateMapping () {
        this.mapping.set(8, 42);   // Backspace
        this.mapping.set(9, 43);   // Tab
        this.mapping.set(13, 40);  // Enter
        this.mapping.set(19, 72);  // Pause/break
        this.mapping.set(20, 57);  // Caps lock
        this.mapping.set(27, 41);  // Escape
        this.mapping.set(32, 44);  // (space)
        this.mapping.set(33, 75);  // Page up
        this.mapping.set(34, 78);  // Page down
        this.mapping.set(35, 77);  // End
        this.mapping.set(36, 74);  // Home
        this.mapping.set(37, 80);  // Left arrow
        this.mapping.set(38, 82);  // Up arrow
        this.mapping.set(39, 79);  // Right arrow
        this.mapping.set(40, 81);  // Down arrow
        this.mapping.set(45, 73);  // Insert
        this.mapping.set(46, 76);  // Delete
        this.mapping.set(48, 39);  // 0
        this.mapping.set(49, 30);  // 1
        this.mapping.set(50, 31);  // 2
        this.mapping.set(51, 32);  // 3
        this.mapping.set(52, 33);  // 4
        this.mapping.set(53, 34);  // 5
        this.mapping.set(54, 35);  // 6
        this.mapping.set(55, 36);  // 7
        this.mapping.set(56, 37);  // 8
        this.mapping.set(57, 38);  // 9
        this.mapping.set(65, 4);   // A
        this.mapping.set(66, 5);   // B
        this.mapping.set(67, 6);   // C
        this.mapping.set(68, 7);   // D
        this.mapping.set(69, 8);   // E
        this.mapping.set(70, 9);   // F
        this.mapping.set(71, 10);  // G
        this.mapping.set(72, 11);  // H
        this.mapping.set(73, 12);  // I
        this.mapping.set(74, 13);  // J
        this.mapping.set(75, 14);  // K
        this.mapping.set(76, 15);  // L
        this.mapping.set(77, 16);  // M
        this.mapping.set(78, 17);  // N
        this.mapping.set(79, 18);  // O
        this.mapping.set(80, 19);  // P
        this.mapping.set(81, 20);  // Q
        this.mapping.set(82, 21);  // R
        this.mapping.set(83, 22);  // S
        this.mapping.set(84, 23);  // T
        this.mapping.set(85, 24);  // U
        this.mapping.set(86, 25);  // V
        this.mapping.set(87, 26);  // W
        this.mapping.set(88, 27);  // X
        this.mapping.set(89, 28);  // Y
        this.mapping.set(90, 29);  // Z
        this.mapping.set(93, 118);  // Menu
        this.mapping.set(96, 98);  // Num pad 0
        this.mapping.set(97, 89);  // Num pad 1
        this.mapping.set(98, 90);  // Num pad 2
        this.mapping.set(99, 91);  // Num pad 3
        this.mapping.set(100, 92); // Num pad 4
        this.mapping.set(101, 93); // Num pad 5
        this.mapping.set(102, 94); // Num pad 6
        this.mapping.set(103, 95); // Num pad 7
        this.mapping.set(104, 96); // Num pad 8
        this.mapping.set(105, 97); // Num pad 9
        this.mapping.set(106, 85); // Multiply
        this.mapping.set(107, 87); // Add
        this.mapping.set(109, 86); // Subtract
        this.mapping.set(110, 99); // Decimal point
        this.mapping.set(111, 84); // Divide
        this.mapping.set(112, 58); // F1
        this.mapping.set(113, 59); // F2
        this.mapping.set(114, 60); // F3
        this.mapping.set(115, 61); // F4
        this.mapping.set(116, 62); // F5
        this.mapping.set(117, 63); // F6
        this.mapping.set(118, 64); // F7
        this.mapping.set(119, 65); // F8
        this.mapping.set(120, 66); // F9
        this.mapping.set(121, 67); // F10
        this.mapping.set(122, 68); // F11
        this.mapping.set(123, 69); // F12
        this.mapping.set(144, 83); // Num lock
        this.mapping.set(145, 71); // Scroll lock
        this.mapping.set(186, 51); // Semi-colon
        this.mapping.set(187, 46); // Equal sign
        this.mapping.set(188, 54); // Comma
        this.mapping.set(189, 45); // Dash
        this.mapping.set(190, 55); // Period
        this.mapping.set(191, 56); // Forward slash
        this.mapping.set(192, 53); // Grave accent
        this.mapping.set(219, 47); // Open bracket
        this.mapping.set(220, 49); // Back slash
        this.mapping.set(221, 48); // Close bracket
        this.mapping.set(222, 52); // Single quote
    }

    private reMap(value: Map<number, boolean>): boolean[] {
        return [value.get(16), value.get(17), value.get(91), value.get(18)];
    }
}
