import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { colord } from 'colord';
import { ColorPickerDirective } from 'ngx-color-picker';
import { RgbColorInterface } from 'uhk-common';

import { getColorsOf } from '../../../util/get-colors-of';

@Component({
    selector: 'color-palette-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'color-palette-button.component.html',
    host: {
        class: "btn btn-default",
        tabindex: '0',
        type: "button",
    },
})
export class ColorPaletteButtonComponent implements OnChanges {
    @Input() color: RgbColorInterface;
    @Input() selected: boolean;
    @Input() selectedPaletteColorIndex: number;

    @Output() modifyColor = new EventEmitter<RgbColorInterface>();

    @ViewChild(ColorPickerDirective) colorPicker: ColorPickerDirective;

    colorPickerDisabled = true;
    editColor = '#000000';
    faCheck = faCheck;

    private mouseIn = false;

    constructor(private host: ElementRef,
                private tooltip: NgbTooltip) {
        this.tooltip.autoClose = false;
        this.tooltip.placement = 'top';
        this.tooltip.triggers = 'manual';
        this.tooltip.container = 'body';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.color) {
            this.editColor = colord(this.color).toHex();
        }

        if (changes.selected) {
            this.updateTooltipText();
        }

        if (changes.selectedPaletteColorIndex) {
            this.setTooltipPlacement();
        }
    }

    @HostBinding('style.backgroundColor')
    get bgColor(): string {
        if (!this.color) {
            return 'inherit';
        }

        return getColorsOf(this.color).backgroundColorAsHex;
    }

    @HostBinding('style.color')
    get fontColor(): string {
        if (!this.color) {
            return 'inherit';
        }

        if (this.selected) {
            return getColorsOf(this.color).fontColorAsHex;
        }

        return getColorsOf(this.color).backgroundColorAsHex;
    }

    @HostListener('focus')
    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.mouseIn = true;
        this.tooltip.ngbTooltip = this.tooltipText();
        this.tooltip.open();
    }

    @HostListener('blur')
    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.mouseIn = false;
        if(!this.selected) {
            this.tooltip.close();
        }
    }

    @HostListener('contextmenu', ['$event'])
    onContextmenu(event: MouseEvent): void {
        event.preventDefault();
        this.colorPickerDisabled = false;
        this.colorPicker.openDialog();
    }

    onColorPickerClosed() {
        this.colorPickerDisabled = true;
    }

    onColorSelected(value: string) {
        this.modifyColor.emit(colord(value).toRgb());
    }

    private tooltipText(): string {
        return this.selected
            ? 'Click on the keys to paint them. Click this button again to finish painting.'
            : 'Click on the desired color to start painting keys with it. Right click to modify the color.';
    }

    private updateTooltipText(): void {
        this.tooltip.ngbTooltip = this.tooltipText();

        // It is a workaround to update the tooltip text after the selected state changed
        const tooltipInnerId = this.host.nativeElement.getAttribute('aria-describedby');
        if (tooltipInnerId) {
            const tooltipInner = document.querySelector(`#${tooltipInnerId} .tooltip-inner`);
            tooltipInner.textContent = this.tooltipText();
        }

        if (!this.mouseIn){
            this.tooltip.close();
        }
    }

    private setTooltipPlacement(): void {
        if (this.selected) {
            this.tooltip.placement = 'top';
        } else if (this.selectedPaletteColorIndex > -1) {
            this.tooltip.placement = 'bottom';
        } else {
            this.tooltip.placement = 'top';
        }
    }
}
