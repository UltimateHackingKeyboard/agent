import { Directive, ElementRef, AfterContentInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[data-toggle="tooltip"]'
})
export class TooltipDirective implements AfterContentInit {

    private customTooltipTemplate = `
        <div class="tooltip">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner"></div>
        </div>
    `;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngAfterContentInit() {
        jQuery(this.elementRef.nativeElement).tooltip({
            placement: 'top',
            html: true,
            template: this.customTooltipTemplate
        });
    }

}
