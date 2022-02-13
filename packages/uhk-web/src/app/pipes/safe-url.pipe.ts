import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string): SafeUrl | SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
