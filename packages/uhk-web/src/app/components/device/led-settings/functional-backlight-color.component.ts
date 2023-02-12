import { HostBinding } from '@angular/core';
import { ChangeDetectionStrategy, Input } from '@angular/core';
import { Component } from '@angular/core';
import { colord, extend, RgbColor } from 'colord';
import a11yPlugin from "colord/plugins/a11y";
extend([a11yPlugin]);

@Component({
    selector: 'functional-backlight-color',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'functional-backlight-color.component.html',
    styleUrls: ['./functional-backlight-color.component.scss']
})
export class FunctionalBacklightColorComponent {
    @Input() color: RgbColor;
    @Input() label: string;

    onColorChanged(value) {
        console.log(value);
    }

    @HostBinding('style.background-color')
    get getHex(): string {
        if (!this.color) {
            return '';
        }

        return colord(this.color).toHex();
    }

    @HostBinding('style.color')
    get colorHex(): string {
        if (!this.color) {
            return '#ffffff';
        }

        const color = colord(this.color);
        if (color.isReadable('#ffffff'))
            return '#ffffff';

        return '#000000';
    }
}
