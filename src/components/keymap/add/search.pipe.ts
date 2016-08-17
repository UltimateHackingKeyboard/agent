import { Pipe, PipeTransform } from '@angular/core';
import { Keymap } from '../../../../config-serializer/config-items/Keymap';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {
    transform(value: Keymap[], term: string)  {
        if(term === undefined) {
            return value;
        }

        term = term.toLocaleLowerCase();
        return value.filter((item: Keymap) => item.name.toLocaleLowerCase().indexOf(term) !== -1);
    }
}
