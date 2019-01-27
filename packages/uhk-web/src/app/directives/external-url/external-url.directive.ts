import { Directive, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../store';
import { OpenUrlInNewWindowAction } from '../../store/actions/app';

@Directive({
    selector: 'a[externalUrl]'
})
export class ExternalUrlDirective {
    constructor(private el: ElementRef, private store: Store<AppState>) {}

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();

        const anchor = this.el.nativeElement as HTMLAnchorElement;
        if (anchor.href) {
            this.store.dispatch(new OpenUrlInNewWindowAction(anchor.href));
        }
    }
}
