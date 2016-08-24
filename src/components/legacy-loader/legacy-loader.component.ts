import { Component } from '@angular/core';
import { DomSanitizationService, SafeResourceUrl } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

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

    constructor(private sanitationService: DomSanitizationService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe((params: { id: string }) => {
            if (params.id) {
                this.safeLink = this.sanitationService.bypassSecurityTrustResourceUrl(params.id + 'Legacy.html');
            }
        });
    }
}
