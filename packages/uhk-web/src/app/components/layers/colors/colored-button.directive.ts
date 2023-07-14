import { Directive, ElementRef, Input, HostBinding, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RgbColorInterface } from 'uhk-common';

import { getColorsOf } from '../../../util/get-colors-of';

@Directive({
    selector: '[coloredButton]',
})
export class ColoredButtonDirective implements OnChanges {
    @Input() color: RgbColorInterface;
    @Input() selected: boolean;
    @Input() selectedPaletteColorIndex: number;

    private mouseIn = false;

    constructor(private host: ElementRef,
                private tooltip: NgbTooltip) {
        this.tooltip.autoClose = false;
        this.tooltip.placement = 'top';
        this.tooltip.triggers = 'manual';
        this.tooltip.container = 'body';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selected) {
            this.updateTooltipText();
        }

        if (changes.selectedPaletteColorIndex) {
            if (this.selected) {
                this.tooltip.placement = 'top';
            } else if (this.selectedPaletteColorIndex > -1) {
                this.tooltip.placement = 'bottom';
            } else {
                this.tooltip.placement = 'top';
            }
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

    private tooltipText(): string {
        return this.selected
            ? 'Click on the keys to paint them. Click this button again to finish painting.'
            : 'Click on the desired color to start painting keys with it.';
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
}
