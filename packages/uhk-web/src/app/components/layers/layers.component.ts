import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { RgbColor } from 'colord';
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
    @Input() paletteColors: Array<RgbColor> = [];
    @Input() selectedPaletteColorIndex = -1;
    @Input() showPaletteColors = false;

    @Output() addColorToPalette = new EventEmitter<RgbColor>();
    @Output() deleteColorFromPalette = new EventEmitter();
    @Output() select = new EventEmitter<LayerOption>();
    @Output() toggleColorFromPalette = new EventEmitter<number>();
    @Output() addLayer = new EventEmitter<number>();
    @Output() removeLayer = new EventEmitter<number>();

    faCheck = faCheck;
    faPlus = faPlus;
    faTrash = faTrash;

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
        this.toggleColorFromPalette.emit(index);
    }

    onDeleteColor(): void {
        this.deleteColorFromPalette.emit();
    }

    onAddColor(event: Event): void {
        const target = <HTMLInputElement>event.target;
        this.addColorToPalette.emit(colord(target.value).toRgb());
    }
}
