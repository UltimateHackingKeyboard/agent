import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LayerOption } from '../../models';

@Component({
    selector: 'layers',
    templateUrl: './layers.component.html',
    styleUrls: ['./layers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayersComponent {
    @Input() current: LayerOption;
    @Input() layerOptions: LayerOption[];

    @Output() select = new EventEmitter<LayerOption>();
    @Output() addLayer = new EventEmitter<number>();
    @Output() removeLayer = new EventEmitter<number>();

    selectLayer(option: LayerOption) {
        if (this.current?.id === option.id) {
            return;
        }

        this.select.emit(option);
    }

    trackLayer(index: number, layer: LayerOption): string {
        return layer.id.toString();
    }

    onRemoveLayer(layerOption: LayerOption): void {
        this.removeLayer.emit(layerOption.id);
    }

    onSelectLayer(layerOption: LayerOption): void {
        this.addLayer.emit(layerOption.id);
    }
}
