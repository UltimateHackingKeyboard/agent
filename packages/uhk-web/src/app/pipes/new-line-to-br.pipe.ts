import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'newLineToBr'
})
export class NewLineToBrPipe implements PipeTransform {

    transform(text: string): string {
        return text.replace(/\n/g, '<br>');
    }
}
