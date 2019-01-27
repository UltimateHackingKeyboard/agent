import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[cancelable]'
})
export class CancelableDirective {
    private originalValue: string;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @HostListener('focus') onFocus(): void {
        this.originalValue = this.elementRef.nativeElement.value;
    }

    @HostListener('keyup.escape') onEscape(): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.originalValue);
        this.elementRef.nativeElement.blur();
    }
}
