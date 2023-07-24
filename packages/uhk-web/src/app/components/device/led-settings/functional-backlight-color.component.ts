import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { colord, } from 'colord';
import { RgbColorInterface } from 'uhk-common';

import { Colors, getColorsOf } from '../../../util/get-colors-of';

@Component({
    selector: 'functional-backlight-color',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'functional-backlight-color.component.html',
    styleUrls: ['./functional-backlight-color.component.scss']
})
export class FunctionalBacklightColorComponent implements OnChanges {
    @Input() color: RgbColorInterface;
    @Input() label: string;

    @Output() colorChanged = new EventEmitter<RgbColorInterface>();

    colors: Colors;

    tmpHexColor: string;

    onColorChanged(value: string) {
        this.colorChanged.emit(colord(value).toRgb());
    }

    @HostBinding('style.background-color')
    get getHex(): string {
        return this.colors.backgroundColorAsHex;
    }

    @HostBinding('style.color')
    get colorHex(): string {
        return this.colors.fontColorAsHex;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.color) {
            this.colors = getColorsOf(this.color);
            this.tmpHexColor = this.colors.fontColorAsHex;
        }
    }
}
