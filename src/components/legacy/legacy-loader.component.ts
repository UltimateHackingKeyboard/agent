import { Component, Input, HostBinding } from '@angular/core';
import { DomSanitizationService, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'legacy',
    template:
        `
         <iframe [src]="safeLink" frameborder="0" scrolling="no"></iframe>
    `,
    styles: [require('./legacy-loader.component.scss')]
})
export class LegacyLoaderComponent {
    private safeLink: SafeResourceUrl;

    constructor(private sanitationService: DomSanitizationService) {
    }

    ngOnInit() {
        this.safeLink = this.sanitationService.bypassSecurityTrustResourceUrl("keymapLegacy.html");
    }
}
