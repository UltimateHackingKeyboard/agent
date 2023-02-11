import { ChangeDetectionStrategy, Input } from '@angular/core';
import { Component } from '@angular/core';
import { colord, RgbColor } from 'colord';

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

    getHex(): string {
        if (!this.color) {
            return '';
        }

        return colord(this.color).toHex();
    }
}
