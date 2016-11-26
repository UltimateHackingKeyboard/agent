import { Directive, ElementRef, HostListener, Renderer } from '@angular/core';

@Directive({
    selector: '[cancelable]'
})
export class CancelableDirective {

    private originalValue: string;

    constructor(private elementRef: ElementRef, private renderer: Renderer) { }

    @HostListener('focus') onFocus(): void {
        this.originalValue = this.elementRef.nativeElement.value;
    }

    @HostListener('keyup.escape') onEscape(): void {
        this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', this.originalValue);
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'blur');
    }

}
