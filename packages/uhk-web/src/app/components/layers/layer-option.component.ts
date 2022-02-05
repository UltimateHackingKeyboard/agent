import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { LayerOption } from '../../models';
import { ConfirmCancelEvent } from 'angular-confirmation-popover/lib/confirmation-popover.directive';

@Component({
    selector: 'layer-option',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layer-option.component.html',
    styleUrls: ['./layer-option.component.scss']
})
export class LayerOptionComponent {
    @Input() layerOption: LayerOption;
    @Output() remove = new EventEmitter<LayerOption>();
    @Output() select = new EventEmitter<LayerOption>();

    @HostListener('click', ['$event'])
    onClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (!this.layerOption.selected) {
            this.select.emit(this.layerOption);
        }
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
