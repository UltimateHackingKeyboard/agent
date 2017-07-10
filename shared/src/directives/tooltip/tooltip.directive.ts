import { Directive, ElementRef, Input, AfterContentInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[data-toggle="tooltip"]'
})
export class TooltipDirective implements AfterContentInit {

    @Input() header: string;
    @Input() headerIcon: string;
    @Input() placement = 'top';

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngAfterContentInit() {
        const tooltipHeaderIcon = this.headerIcon ? `
            <span class="glyphicon glyphicon-${this.headerIcon}"></span>
        ` : '';

        const tooltipHeader = this.header ? `
            <div class="tooltip-head">
                <h3>${tooltipHeaderIcon}${this.header}</h3>
            </div>
        ` : '';

        const customTooltipTemplate = `
            <div class="tooltip">
                <div class="tooltip-arrow"></div>
                ${tooltipHeader}
                <div class="tooltip-inner"></div>
            </div>
        `;

        jQuery(this.elementRef.nativeElement).tooltip({
            placement: this.placement,
            title: 'No title',
            template: customTooltipTemplate
        });
    }

}
