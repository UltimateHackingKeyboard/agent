import { Directive, ElementRef, OnDestroy } from '@angular/core';

import { SmartMacroDocService } from '../../../services/smart-macro-doc-service';

@Directive({
    selector: 'iframe[smartMacroIframe]'
})
export class SmartMacroDocDirective implements OnDestroy {
    constructor(private elementRef: ElementRef,
                private smartMacroDocService: SmartMacroDocService) {
        this.smartMacroDocService.setIframe(this.elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.smartMacroDocService.setIframe(undefined);
    }

}
