import { OnDestroy, Directive } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';

const MAX_HEIGHT_OFFSET = 20;

@Directive({
    selector: 'ng-select[select-max-height]'
})
export class NgSelectMaxHeight implements OnDestroy {
    private openSubscription: Subscription;

    constructor(private host: NgSelectComponent) {
        this.openSubscription = host.openEvent.subscribe(() => {
            // do it after the dropdown panel is rendered
            setTimeout(()=> {
                this.host.element.querySelector('input').select();
                this.maximiseScancodeDropdownHeight();
            }, 1);
        });
    }

    ngOnDestroy(): void {
        this.openSubscription.unsubscribe();
    }

    private maximiseScancodeDropdownHeight(): void {
        const scancodeSelectRec = this.host.element.getBoundingClientRect();
        const scancodeMiddle = scancodeSelectRec.top + scancodeSelectRec.height / 2;
        const dropdownPanel: HTMLDivElement = this.host.element.querySelector('ng-dropdown-panel');
        const dropdownPanelItems: HTMLDivElement = dropdownPanel.querySelector('.ng-dropdown-panel-items');
        const placement = window.document.body.clientHeight / 2 < scancodeMiddle ? 'top' : 'bottom';

        let newHeight;
        if (placement === 'top') {
            newHeight = scancodeSelectRec.top - MAX_HEIGHT_OFFSET;
            dropdownPanel.classList.add('ng-select-top');
            dropdownPanel.classList.remove('ng-select-bottom');
        } else {
            newHeight = window.document.body.clientHeight - scancodeSelectRec.bottom - MAX_HEIGHT_OFFSET;
            dropdownPanel.classList.remove('ng-select-top');
            dropdownPanel.classList.add('ng-select-bottom');
        }

        dropdownPanelItems.style['max-height'] = `${newHeight}px`;
    }
}
