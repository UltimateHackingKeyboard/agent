import { Component, Input } from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'legacy',
    template:
        `
         <div class="{{class}} main-content__inner" style="display: none; height: 100%; width: 100%;">
            <iframe [src]="safeLink" frameborder="0" scrolling="no" style="height: 100vh; width: 100%;"></iframe>
        </div>
    `,
})
export class LegacyLoaderComponent {
    @Input() link: string;
    @Input() class: string;

    private safeLink: SafeResourceUrl;

    constructor(private sanitationService: DomSanitizationService) {
    }

    ngOnInit() {
        this.safeLink = this.sanitationService.bypassSecurityTrustResourceUrl(this.link);
    }
}
