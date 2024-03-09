import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { colord, RgbColor } from 'colord';
import { LayerName, RgbColorInterface } from 'uhk-common';

import { LayerOption, ModifyColorOfBacklightingColorPalettePayload } from '../../models';

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
    @Output() modifyColorPaletteColor = new EventEmitter<ModifyColorOfBacklightingColorPalettePayload>();
    @Output() selectLayer = new EventEmitter<LayerOption>();
    @Output() toggleColorFromPalette = new EventEmitter<number>();
    @Output() addLayer = new EventEmitter<number>();
    @Output() removeLayer = new EventEmitter<number>();

    @ViewChild('deleteTooltip') deleteTooltip: NgbTooltip;

    faPlus = faPlus;
    faTrash = faTrash;
    LayerName = LayerName;
    newColorPaletteColor = '#000000';

    onSelectLayer(option: LayerOption) {
        if (this.current?.id === option.id) {
            return;
        }

        this.selectLayer.emit(option);
    }

    trackLayer(index: number, layer: LayerOption): string {
        return layer.id.toString();
    }

    onRemoveLayer(layerOption: LayerOption): void {
        this.removeLayer.emit(layerOption.id);
    }

    onAddLayer(layerOption: LayerOption): void {
        this.addLayer.emit(layerOption.id);
    }

    onColorSelected(index): void {
        this.toggleColorFromPalette.emit(index);
    }

    onDeleteColor(): void {
        this.deleteColorFromPalette.emit();
    }

    onAddColor(value: string): void {
        this.addColorToPalette.emit(colord(value).toRgb());
    }

    onDeleteConfirmationShown(isOpen: boolean): void {
        if (!this.deleteTooltip) {
            return;
        }

        if (isOpen) {
            this.deleteTooltip.disableTooltip = true;
            this.deleteTooltip.close();
        } else {
            this.deleteTooltip.disableTooltip = false;
        }
    }

    onModifyColor(index: number, color: RgbColorInterface): void {
        this.modifyColorPaletteColor.emit({
            color,
            index,
        });
    }
}
