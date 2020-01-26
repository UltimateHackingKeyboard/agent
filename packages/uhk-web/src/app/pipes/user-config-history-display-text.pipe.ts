import { Pipe, PipeTransform } from '@angular/core';
import { convertHistoryFilenameToDisplayText } from 'uhk-common';

@Pipe({
    name: 'userConfigHistory'
})
export class UserConfigHistoryDisplayTextPipe implements PipeTransform {

    transform(filename: string): string {
        return convertHistoryFilenameToDisplayText(filename);
    }
}
