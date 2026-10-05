import { Pipe, PipeTransform, inject } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
    standalone: false,
})
export class SafeHtmlPipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

    transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
