import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { KeyModifiers, KeystrokeAction } from 'uhk-common';

import { MapperService } from '../../../../services/mapper.service';
import { isRectangleAsSecondaryRoleKey } from '../util';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';

class SvgAttributes {
    width: number;
    height: number;
    x: number;
    y: number;
    disabled: boolean;

    constructor() {
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.disabled = true;
    }
}

@Component({
    selector: 'g[svg-keystroke-key]',
    templateUrl: './svg-keystroke-key.component.html',
    styleUrls: ['./svg-keystroke-key.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgKeystrokeKeyComponent implements OnChanges {
    @Input() height: number;
    @Input() width: number;
    @Input() keystrokeAction: KeystrokeAction;
    @Input() secondaryText: string;

    viewBox: string;
    textContainer: SvgAttributes;
    modifierContainer: SvgAttributes;
    shift: SvgAttributes;
    control: SvgAttributes;
    option: SvgAttributes;
    command: SvgAttributes;

    labelSource: any;
    labelType: 'empty' | 'one-line' | 'two-line' | 'icon';

    modifierIconNames: {
        shift?: string,
        option?: string,
        command?: string
    };
    secondaryTextY: number;
    secondaryTextWidth: number;
    secondaryHeight: number;

    constructor(private mapper: MapperService) {
        this.modifierIconNames = {};
        this.textContainer = new SvgAttributes();
        this.modifierContainer = new SvgAttributes();
        this.shift = new SvgAttributes();
        this.control = new SvgAttributes();
        this.option = new SvgAttributes();
        this.command = new SvgAttributes();
    }

    ngOnChanges() {
        if (this.keystrokeAction.hasScancode()) {
            const scancode: number = this.keystrokeAction.scancode;
            this.labelSource = this.mapper.scanCodeToSvgImagePath(scancode, this.keystrokeAction.type);
            if (this.labelSource) {
                this.labelType = 'icon';
            } else {
                let newLabelSource: string[];
                newLabelSource = this.mapper.scanCodeToText(scancode, this.keystrokeAction.type);
                if (newLabelSource) {
                    if (this.secondaryText && newLabelSource.length === 2) {
                        this.labelSource = newLabelSource[0];
                        this.labelType = 'one-line';
                    }
                    else {
                        if (newLabelSource.length === 1) {
                            this.labelSource = newLabelSource[0];
                            this.labelType = 'one-line';
                        } else {
                            this.labelSource = newLabelSource;
                            this.labelType = 'two-line';
                        }
                    }
                }
            }
        } else {
            this.labelType = 'empty';
        }

        this.shift.disabled = !this.keystrokeAction.isActive(KeyModifiers.leftShift | KeyModifiers.rightShift);
        this.control.disabled = !this.keystrokeAction.isActive(KeyModifiers.leftCtrl | KeyModifiers.rightCtrl);
        this.option.disabled = !this.keystrokeAction.isActive(KeyModifiers.leftAlt | KeyModifiers.rightAlt);
        this.command.disabled = !this.keystrokeAction.isActive(KeyModifiers.leftGui | KeyModifiers.rightGui);

        this.calculatePositions();
    }

    private calculatePositions(): void {
        let textYModifier = 0;
        let secondaryYModifier = 0;

        if (this.secondaryText && isRectangleAsSecondaryRoleKey(this.width, this.height)) {
            textYModifier = this.height / 5;
            secondaryYModifier = 5;
        }

        this.secondaryHeight = this.secondaryText ? this.height / 4 : 0;
        this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;

        this.viewBox = [0, 0, this.width, this.height].join(' ');
        this.modifierIconNames.shift = this.mapper.getIcon('shift');
        this.modifierIconNames.option = this.mapper.getIcon('option');
        this.modifierIconNames.command = this.mapper.getIcon('command');

        const bottomSideMode: boolean = this.width < this.height * 1.8;

        const heightWidthRatio = this.height / this.width;
        this.secondaryTextWidth = this.width;

        if (bottomSideMode) {
            const maxIconWidth = this.width / 4;
            const maxIconHeight = this.height;
            const iconScalingFactor = 0.8;
            const iconWidth = iconScalingFactor * heightWidthRatio * maxIconWidth;
            const iconHeight = iconScalingFactor * maxIconHeight;
            this.modifierContainer.width = this.width;
            this.modifierContainer.height = this.height / 5;
            this.modifierContainer.y = this.height - this.modifierContainer.height - this.secondaryHeight;
            this.shift.width = iconWidth;
            this.shift.height = iconHeight;
            this.shift.x = (maxIconWidth - iconWidth) / 2;
            this.shift.y = (maxIconHeight - iconHeight) / 2;
            this.control.width = iconWidth;
            this.control.height = iconHeight;
            this.control.x = this.shift.x + maxIconWidth;
            this.control.y = this.shift.y;
            this.option.width = iconWidth;
            this.option.height = iconHeight;
            this.option.x = this.control.x + maxIconWidth;
            this.option.y = this.shift.y;
            this.command.width = iconWidth;
            this.command.height = iconHeight;
            this.command.x = this.option.x + maxIconWidth;
            this.command.y = this.shift.y;
            this.textContainer.y = -this.modifierContainer.height / 2 - this.secondaryHeight / 2;
        } else {
            this.modifierContainer.width = this.width / 4;
            this.modifierContainer.height = this.height;
            this.modifierContainer.x = this.width - this.modifierContainer.width;

            const length = Math.min(this.modifierContainer.width / 2, this.modifierContainer.height / 2);

            const iconScalingFactor = 0.8;
            const iconWidth = iconScalingFactor * this.width * (length / this.modifierContainer.width);
            const iconHeight = iconScalingFactor * this.height * (length / this.modifierContainer.height);
            this.shift.width = iconWidth;
            this.shift.height = iconHeight;
            this.shift.x = this.width / 4 - iconWidth / 2;
            this.shift.y = this.height / 4 - iconHeight / 2;
            this.control.width = iconWidth;
            this.control.height = iconHeight;
            this.control.x = this.shift.x + this.width / 2;
            this.control.y = this.shift.y;
            this.option.width = iconWidth;
            this.option.height = iconHeight;
            this.option.x = this.shift.x;
            this.option.y = this.shift.y + this.height / 2;
            this.command.width = iconWidth;
            this.command.height = iconHeight;
            this.command.x = this.option.x + this.width / 2;
            this.command.y = this.option.y;
            this.textContainer.x = -this.modifierContainer.width / 2;
            this.secondaryTextWidth = this.width - this.modifierContainer.width;
        }

        this.textContainer.y -= textYModifier;
        this.textContainer.width = this.width;
        this.textContainer.height = this.height;
    }
}
