import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { faCopy, faPaste, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { colord, RgbColor } from 'colord';
import { LayerName, RgbColorInterface } from 'uhk-common';

import { LayerOption, CopiedLayerOrigin, ModifyColorOfBacklightingColorPalettePayload } from '../../models';

@Component({
    selector: 'layers',
    standalone: false,
    templateUrl: './layers.component.html',
    styleUrls: ['./layers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayersComponent {
    @Input() allowLayerCopy = false;
    @Input() allowNewLayers: boolean;
    @Input() canPasteLayer = false;
    @Input() copiedLayerOrigin: CopiedLayerOrigin;
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
    @Output() copyLayer = new EventEmitter<void>();
    @Output() pasteLayer = new EventEmitter<void>();
    @Output() removeLayer = new EventEmitter<number>();

    @ViewChild('deleteTooltip') deleteTooltip: NgbTooltip;

    faCopy = faCopy;
    faPaste = faPaste;
    faPlus = faPlus;
    faTrash = faTrash;
    LayerName = LayerName;
    newColorPaletteColor = '#000000';

    get pasteLayerTooltip(): string {
        const origin = this.copiedLayerOrigin;
        if (!origin) {
            return `Overwrite the current layer with the layer stored in Agent's virtual clipboard.`;
        }

        return `Overwrite the current layer with the ${origin.deviceName}: ${origin.keymapName}: ${origin.layerName} layer stored in Agent's virtual clipboard.`;
    }

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

    onCopyLayer(): void {
        this.copyLayer.emit();
    }

    onPasteLayer(): void {
        this.pasteLayer.emit();
    }

    onColorSelected(index: number): void {
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
