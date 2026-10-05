import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safeUrl',
    standalone: false,
})
export class SafeUrlPipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

    transform(url: string): SafeUrl | SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
