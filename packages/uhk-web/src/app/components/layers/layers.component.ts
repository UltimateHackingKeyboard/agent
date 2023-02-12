import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { colord } from 'colord';

import { LayerOption } from '../../models';

@Component({
    selector: 'layers',
    templateUrl: './layers.component.html',
    styleUrls: ['./layers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayersComponent {
    @Input() allowNewLayers: boolean;
    @Input() current: LayerOption;
    @Input() layerOptions: LayerOption[];

    @Output() select = new EventEmitter<LayerOption>();
    @Output() addLayer = new EventEmitter<number>();
    @Output() removeLayer = new EventEmitter<number>();

    faCheck = faCheck;
    faPlus = faPlus;
    faTrash = faTrash;
    paletteColors= [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
    ];

    selectedPaletteColorIndex = -1;

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

    onColorSelected(index): void {
        this.selectedPaletteColorIndex = this.selectedPaletteColorIndex === index
            ? -1
            : index;
    }

    onDeleteColor(): void {
        this.paletteColors.splice(this.selectedPaletteColorIndex, 1);
        this.selectedPaletteColorIndex = -1;
    }

    onAddColor(event: Event): void {
        const target = <HTMLInputElement>event.target;
        this.paletteColors.push(colord(target.value).toRgb());
    }
}
