import { Pipe, PipeTransform, inject } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeStyle',
    standalone: false,
})
export class SafeStylePipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

    transform(style: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }
}
