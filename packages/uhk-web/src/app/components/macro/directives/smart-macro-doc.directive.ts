import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';

import { SmartMacroDocService } from '../../../services/smart-macro-doc-service';

@Directive({
    selector: 'iframe[smartMacroIframe]',
    standalone: false,
})
export class SmartMacroDocDirective implements OnDestroy {
    private readonly elementRef = inject(ElementRef);
    private readonly smartMacroDocService = inject(SmartMacroDocService);

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.smartMacroDocService.setIframe(this.elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.smartMacroDocService.setIframe(undefined);
    }

}
