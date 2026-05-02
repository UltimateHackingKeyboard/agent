import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild
} from '@angular/core';

import { LayerOption } from '../../models';

// TODO: Open a PR to expose it from angular-confirmation-popover
export interface ConfirmCancelEvent {
    clickEvent: MouseEvent;
}

@Component({
    selector: 'layer-option',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layer-option.component.html',
    styleUrls: ['./layer-option.component.scss']
})
export class LayerOptionComponent {

    @Input() layerOption: LayerOption;
    @Output() remove = new EventEmitter<LayerOption>();
    @Output() select = new EventEmitter<LayerOption>();
    @ViewChild('checkbox') checkbox: ElementRef<HTMLInputElement>;

    @HostListener('click', ['$event'])
    onClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (!this.layerOption.selected) {
            this.select.emit(this.layerOption);
        }
        setTimeout(() => {
            this.checkbox.nativeElement.checked = this.layerOption.selected;
        });
    }

    onCheckboxChange(event): void {
        console.log('checkbox', event);
    }

    onRemoveLayer(event: ConfirmCancelEvent): void {
        event.clickEvent.preventDefault();
        event.clickEvent.stopPropagation();

        this.remove.emit(this.layerOption);
    }
}
