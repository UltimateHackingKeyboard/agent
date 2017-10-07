import { Pipe, PipeTransform } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeStyle'
})
export class SafeStylePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(style: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }
}
