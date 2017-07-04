import { Directive, ElementRef, Input, AfterContentInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[data-toggle="tooltip"]'
})
export class TooltipDirective implements AfterContentInit {

    @Input() options: TooltipOptions = {
        placement: 'bottom',
        title: 'Tooltip title not provided'
    };

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    ngAfterContentInit() {
        jQuery(this.elementRef.nativeElement).tooltip(this.options);
    }

}
