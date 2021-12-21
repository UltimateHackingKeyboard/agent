import { Injectable } from '@angular/core';

import { Key } from 'ts-keycode-enum';

import { MapperService } from './mapper.service';
import { KeyModifiers } from 'uhk-common';
import { KeyModifierModel } from '../models/key-modifier-model';

@Injectable()
export class CaptureService {
    private mapping: Map<number, number>;
    private readonly leftModifiers: Map<number, KeyModifierModel>;
    private readonly rightModifiers: Map<number, KeyModifierModel>;

    constructor(private mapper: MapperService) {
        this.leftModifiers = new Map<number, KeyModifierModel>();
        this.rightModifiers = new Map<number, KeyModifierModel>();
        this.mapping = new Map<number, number>();
        this.populateMapping();
    }

    public getMap(code: number) {
        return this.mapping.get(code);
    }

    public hasMap(code: number) {
        return this.mapping.has(code);
    }

    public setModifier(left: boolean, code: number) {
        const map = left ? this.leftModifiers : this.rightModifiers;
        map.get(code).checked = true;
    }

    public getModifiers(left: boolean) {
        const map = left ? this.leftModifiers : this.rightModifiers;

        return Array.from(map.values());
    }

    public hasModifiers(): boolean {
        return this.getModifiers(true).some(x => x.checked)
            || this.getModifiers(false).some(x => x.checked);
    }

    public initModifiers() {
        this.leftModifiers.set(Key.Shift, {
            text: 'LShift',
            value: KeyModifiers.leftShift,
            checked: false
        });
        this.leftModifiers.set(Key.Ctrl, {
            text: 'LCtrl',
            value: KeyModifiers.leftCtrl,
            checked: false
        });
        this.leftModifiers.set(Key.Alt, {
            text: this.mapper.getOsSpecificText('LAlt'),
            value: KeyModifiers.leftAlt,
            checked: false
        });
        this.leftModifiers.set(Key.LeftWindowKey, {
            text: this.mapper.getOsSpecificText('LSuper'),
            value: KeyModifiers.leftGui,
            checked: false
        });

        this.rightModifiers.set(Key.Shift, {
            text: 'RShift',
            value: KeyModifiers.rightShift,
            checked: false
        });
        this.rightModifiers.set(Key.Ctrl, {
            text: 'RCtrl',
            value: KeyModifiers.rightCtrl,
            checked: false
        });
        this.rightModifiers.set(Key.Alt, {
            text: this.mapper.getOsSpecificText('RAlt'),
            value: KeyModifiers.rightAlt,
            checked: false
        });
        this.rightModifiers.set(Key.LeftWindowKey, {
            text: this.mapper.getOsSpecificText('RSuper'),
            value: KeyModifiers.rightGui,
            checked: false
        });
    }

    public populateMapping() {
        this.mapping.set(Key.Backspace, 42);
        this.mapping.set(Key.Tab, 43);
        this.mapping.set(Key.Enter, 40);
        this.mapping.set(Key.PauseBreak, 72);
        this.mapping.set(Key.CapsLock, 57);
        this.mapping.set(Key.Escape, 41);
        this.mapping.set(Key.Space, 44);
        this.mapping.set(Key.PageUp, 75);
        this.mapping.set(Key.PageDown, 78);
        this.mapping.set(Key.End, 77);
        this.mapping.set(Key.Home, 74);
        this.mapping.set(Key.LeftArrow, 80);
        this.mapping.set(Key.UpArrow, 82);
        this.mapping.set(Key.RightArrow, 79);
        this.mapping.set(Key.DownArrow, 81);
        this.mapping.set(Key.Insert, 73);
        this.mapping.set(Key.Delete, 76);
        this.mapping.set(Key.Zero, 39);
        this.mapping.set(Key.One, 30);
        this.mapping.set(Key.Two, 31);
        this.mapping.set(Key.Three, 32);
        this.mapping.set(Key.Four, 33);
        this.mapping.set(Key.Five, 34);
        this.mapping.set(Key.Six, 35);
        this.mapping.set(Key.Seven, 36);
        this.mapping.set(Key.Eight, 37);
        this.mapping.set(Key.Nine, 38);
        this.mapping.set(Key.A, 4);
        this.mapping.set(Key.B, 5);
        this.mapping.set(Key.C, 6);
        this.mapping.set(Key.D, 7);
        this.mapping.set(Key.E, 8);
        this.mapping.set(Key.F, 9);
        this.mapping.set(Key.G, 10);
        this.mapping.set(Key.H, 11);
        this.mapping.set(Key.I, 12);
        this.mapping.set(Key.J, 13);
        this.mapping.set(Key.K, 14);
        this.mapping.set(Key.L, 15);
        this.mapping.set(Key.M, 16);
        this.mapping.set(Key.N, 17);
        this.mapping.set(Key.O, 18);
        this.mapping.set(Key.P, 19);
        this.mapping.set(Key.Q, 20);
        this.mapping.set(Key.R, 21);
        this.mapping.set(Key.S, 22);
        this.mapping.set(Key.T, 23);
        this.mapping.set(Key.U, 24);
        this.mapping.set(Key.V, 25);
        this.mapping.set(Key.W, 26);
        this.mapping.set(Key.X, 27);
        this.mapping.set(Key.Y, 28);
        this.mapping.set(Key.Z, 29);
        this.mapping.set(Key.SelectKey, 101);
        this.mapping.set(Key.Numpad0, 98);
        this.mapping.set(Key.Numpad1, 89);
        this.mapping.set(Key.Numpad2, 90);
        this.mapping.set(Key.Numpad3, 91);
        this.mapping.set(Key.Numpad4, 92);
        this.mapping.set(Key.Numpad5, 93);
        this.mapping.set(Key.Numpad6, 94);
        this.mapping.set(Key.Numpad7, 95);
        this.mapping.set(Key.Numpad8, 96);
        this.mapping.set(Key.Numpad9, 97);
        this.mapping.set(Key.Multiply, 85);
        this.mapping.set(Key.Add, 87);
        this.mapping.set(Key.Subtract, 86);
        this.mapping.set(Key.DecimalPoint, 99);
        this.mapping.set(Key.Divide, 84);
        this.mapping.set(Key.F1, 58);
        this.mapping.set(Key.F2, 59);
        this.mapping.set(Key.F3, 60);
        this.mapping.set(Key.F4, 61);
        this.mapping.set(Key.F5, 62);
        this.mapping.set(Key.F6, 63);
        this.mapping.set(Key.F7, 64);
        this.mapping.set(Key.F8, 65);
        this.mapping.set(Key.F9, 66);
        this.mapping.set(Key.F10, 67);
        this.mapping.set(Key.F11, 68);
        this.mapping.set(Key.F12, 69);
        this.mapping.set(Key.NumLock, 83);
        this.mapping.set(Key.ScrollLock, 71);
        this.mapping.set(Key.SemiColon, 51);
        this.mapping.set(Key.Equals, 46);
        this.mapping.set(Key.Comma, 54);
        this.mapping.set(Key.Dash, 45);
        this.mapping.set(Key.Period, 55);
        this.mapping.set(Key.ForwardSlash, 56);
        this.mapping.set(Key.GraveAccent, 53);
        this.mapping.set(Key.OpenBracket, 47);
        this.mapping.set(220, 49); // Backslash
        this.mapping.set(Key.ClosedBracket, 48);
        this.mapping.set(Key.Quote, 52);
    }
}
