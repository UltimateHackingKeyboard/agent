import { HostListener } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { colord, RgbColor } from 'colord';

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

    @ViewChild('addColorToPaletteTooltip', { static: true, read: NgbTooltip })  addColorToPaletteTooltip: NgbTooltip;
    faCheck = faCheck;
    faPlus = faPlus;
    faTrash = faTrash;
    paletteColors= [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
        { r: 0, g: 255, b: 255 },
        { r: 0, g: 0, b: 255 },
        { r: 255, g: 255, b: 0 },
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 255, g: 0, b: 255 },
    ];

    selectedPaletteColorIndex = -1;
    tooltipMsg: string;
    constructor(private _appRef: ApplicationRef) {
        this.tooltipMsg = this.getAddColorToPaletteTooltip();
    }

    isAddColorToPaletteButtonActive = false;
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

    getAddColorToPaletteTooltip(): string {
        return this.isAddColorToPaletteButtonActive
            ? 'Click on a key to add its color to the palette.'
            : 'Add color to the palette.';
    }

    onAddColorButtonMouseEnter(): void {
        this.addColorToPaletteTooltip.open();
    }

    onAddColorButtonMouseLeave(): void {
        if(!this.isAddColorToPaletteButtonActive)
            this.addColorToPaletteTooltip.close();
    }

    onAddColorToPalette(event: MouseEvent): void {
        event.stopPropagation();
        this.isAddColorToPaletteButtonActive = !this.isAddColorToPaletteButtonActive;
        this.tooltipMsg = this.getAddColorToPaletteTooltip();
        const tooltipInner = document.querySelector('.tooltip-inner');
        if (tooltipInner) {
            tooltipInner.textContent = this.tooltipMsg;
        }
    }

    onColorSelected(index): void {
        this.selectedPaletteColorIndex = this.selectedPaletteColorIndex === index
            ? -1
            : index;
    }

    getCheckColor(color, index: number ): string {
        if (this.selectedPaletteColorIndex === index) {
            return colord(color).invert().toRgbString();
        }

        return colord(color).toRgbString();
    }

    @HostListener('document:click')
    onDocumentClick(){
        this.isAddColorToPaletteButtonActive = false;
        this.tooltipMsg = this.getAddColorToPaletteTooltip();
        this.addColorToPaletteTooltip.close();
    }

    onDeleteColor(): void {
        this.paletteColors.splice(this.selectedPaletteColorIndex, 1);
        this.selectedPaletteColorIndex = -1;
    }

    onFinishColor(): void {
        this.selectedPaletteColorIndex = -1;
    }

}
