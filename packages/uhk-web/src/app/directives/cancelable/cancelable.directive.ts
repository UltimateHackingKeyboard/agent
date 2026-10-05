import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
    selector: '[cancelable]',
    standalone: false,
})
export class CancelableDirective {
    private readonly elementRef = inject(ElementRef);
    private originalValue: string;
    private readonly renderer = inject(Renderer2);

    @HostListener('focus') onFocus(): void {
        this.originalValue = this.elementRef.nativeElement.value;
    }

    @HostListener('keyup.escape') onEscape(): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.originalValue);
        this.elementRef.nativeElement.blur();
    }

}
