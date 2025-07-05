import { Pipe, PipeTransform } from '@angular/core';

import { escapeHtml } from '../util/escape-html';

@Pipe({
    name: 'escapeHtml',
})
export class EscapeHtmlPipe implements PipeTransform {

    transform(text: string): string {
        return escapeHtml(text);
    }
}
