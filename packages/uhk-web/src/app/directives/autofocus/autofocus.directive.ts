import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[autofocus]',
    standalone: false,
})
export class Autofocus implements AfterViewInit {
    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        this.el.nativeElement.focus();
    }
}
