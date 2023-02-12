import { Directive, ElementRef, Input, HostBinding, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { colord, RgbColor } from 'colord';

import { blackOrWhiteInverseColor } from '../../../util/black-or-white-inverse-color';

@Directive({
    selector: '[coloredButton]',
})
export class ColoredButtonDirective implements OnChanges {
    @Input() color: RgbColor;
    @Input() selected: boolean;

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
    }
    @HostBinding('style.backgroundColor')
    get bgColor(): string {
        if (!this.color) {
            return 'inherit';
        }

        return colord(this.color).toHex();
    }

    @HostBinding('style.color')
    get fontColor(): string {
        if (!this.color) {
            return 'inherit';
        }

        if (this.selected) {
            return colord(blackOrWhiteInverseColor(this.color)).toHex();
        }

        return colord(this.color).toHex();
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.mouseIn = true;
        this.tooltip.ngbTooltip = this.tooltipText();
        this.tooltip.open();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.mouseIn = false;
        if(!this.selected) {
            this.tooltip.close();
        }
    }

    private tooltipText(): string {
        return this.selected
            ? 'Click on keys to change their color. Click this button again to finish coloring.'
            : 'Click on the color to start the process.';
    }

    private updateTooltipText(): void {
        this.tooltip.ngbTooltip = this.tooltipText();

        // It is a workaround to update the tooltip text after the selected state changed
        const tooltipInnerId = this.host.nativeElement.getAttribute('aria-describedby');
        if (tooltipInnerId) {
            const tooltipInner = document.querySelector(`#${tooltipInnerId} .tooltip-inner`);
            tooltipInner.textContent = this.tooltipText();
            console.log(tooltipInner.textContent);
        }

        if (!this.mouseIn){
            this.tooltip.close();
        }
    }
}
