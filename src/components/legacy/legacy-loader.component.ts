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
    @Input() link: string;
    @Input() class: string;

    private _class: string;
    private safeLink: SafeResourceUrl;

    @HostBinding('class')
    get inputClass() {
        return this._class;
    }

    constructor(private sanitationService: DomSanitizationService) {
    }

    ngOnInit() {
        this.safeLink = this.sanitationService.bypassSecurityTrustResourceUrl(this.link);
        this._class = this.class;
    }
}
