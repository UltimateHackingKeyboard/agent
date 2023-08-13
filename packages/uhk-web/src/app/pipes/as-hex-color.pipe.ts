import { Pipe, PipeTransform } from '@angular/core';
import { colord } from 'colord';
import { RgbColorInterface } from 'uhk-common';

@Pipe({
    name: 'asHexColor'
})
export class AsHexColorPipe implements PipeTransform {
    transform(color: RgbColorInterface): string {
        return colord(color).toHex();
    }
}
