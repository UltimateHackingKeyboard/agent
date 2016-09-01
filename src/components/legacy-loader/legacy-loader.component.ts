import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

    constructor(private domSanitizer: DomSanitizer, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe((params: { id: string }) => {
            if (params.id) {
                this.safeLink = this.domSanitizer.bypassSecurityTrustResourceUrl(params.id + 'Legacy.html');
            }
        });
    }
}
