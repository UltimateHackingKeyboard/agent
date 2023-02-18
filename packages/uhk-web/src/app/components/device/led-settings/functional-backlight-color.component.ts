import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { colord, RgbColor } from 'colord';
import { RgbColorInterface } from 'uhk-common';

import { blackOrWhiteInverseColor } from '../../../util/black-or-white-inverse-color';

@Component({
    selector: 'functional-backlight-color',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'functional-backlight-color.component.html',
    styleUrls: ['./functional-backlight-color.component.scss']
})
export class FunctionalBacklightColorComponent {
    @Input() color: RgbColor;
    @Input() label: string;

    @Output() colorChanged = new EventEmitter<RgbColorInterface>();

    onColorChanged(event: Event) {
        const element = <HTMLInputElement>event.target;
        this.colorChanged.emit(colord(element.value).toRgb());
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
        return colord(blackOrWhiteInverseColor(this.color)).toHex();
    }
}
