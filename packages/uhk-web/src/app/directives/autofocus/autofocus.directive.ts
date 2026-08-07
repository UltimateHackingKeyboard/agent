import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
    selector: '[autofocus]',
    standalone: false,
})
export class Autofocus implements AfterViewInit {
    private readonly el = inject(ElementRef);

    ngAfterViewInit() {
        this.el.nativeElement.focus();
    }
}
