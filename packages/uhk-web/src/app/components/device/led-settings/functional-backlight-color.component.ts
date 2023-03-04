import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { colord, } from 'colord';
import { RgbColorInterface } from 'uhk-common';

import { getColorsOf } from '../../../util/get-colors-of';

@Component({
    selector: 'functional-backlight-color',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'functional-backlight-color.component.html',
    styleUrls: ['./functional-backlight-color.component.scss']
})
export class FunctionalBacklightColorComponent {
    @Input() color: RgbColorInterface;
    @Input() label: string;

    @Output() colorChanged = new EventEmitter<RgbColorInterface>();

    onColorChanged(event: Event) {
        const element = <HTMLInputElement>event.target;
        this.colorChanged.emit(colord(element.value).toRgb());
    }

    @HostBinding('style.background-color')
    get getHex(): string {
        return getColorsOf(this.color).backgroundColorAsHex;
    }

    @HostBinding('style.color')
    get colorHex(): string {
        return getColorsOf(this.color).fontColorAsHex;
    }
}
