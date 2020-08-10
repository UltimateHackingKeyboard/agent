import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { isRectangleAsSecondaryRoleKey } from '../util';
import { SECONDARY_ROLE_BOTTOM_MARGIN } from '../../constants';
import { getContentWidth } from '../../../../util';

@Component({
    selector: 'g[svg-icon-text-key]',
    templateUrl: './svg-icon-text-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconTextKeyComponent implements OnChanges {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;
    @Input() text: string;
    @Input() secondaryText: string;

    useWidth: number;
    useHeight: number;
    useX: number;
    useY: number;
    textY: number;
    spanX: number;
    textWidth: number;
    secondaryTextY: number;
    secondaryHeight: number;
    fontSize: number;
    text1: string;
    text1Y: number;
    text2: string;
    text2Y: number;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calculatePositions();
    }

    private calculatePositions(): void {
        let secondaryYModifier = 0;

        if (this.secondaryText && isRectangleAsSecondaryRoleKey(this.width, this.height)) {
            secondaryYModifier = 5;
        }

        const isRectangle = this.width > this.height * 1.8;

        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;

        if (isRectangle) {
            this.textWidth = this.width * 0.65;
            this.useX = 0;
            this.useY = this.height / 3;
            this.spanX = this.width * 0.6;
        } else {
            this.textWidth = this.width * 0.95;
            this.useX = this.width / 3;
            this.useY = this.height / 10;
            this.spanX = this.width / 2;
        }

        if (this.secondaryText) {
            this.secondaryHeight = this.height / 4;
            this.secondaryTextY = this.height - this.secondaryHeight - SECONDARY_ROLE_BOTTOM_MARGIN - secondaryYModifier;
        } else {
            this.secondaryHeight = 0;
            this.secondaryTextY = 0;
        }
        this.fontSize = 19;
        this.text1 = '';
        this.text2 = '';
        while (this.fontSize > 10 && !this.isFullTextVisible()) {
            this.calculateTexts(isRectangle);
            this.fontSize--;
        }
    }

    private calculateTexts(isRectangle: boolean): void {
        if (!this.text) {
            return;
        }

        this.text1 = this.getText(0);

        this.text2 = this.getText(this.text1.length);

        const lineHeight = this.fontSize;
        const lines = this.text2 ? 1 : 0;

        if (isRectangle) {
            const textboxHeight = this.height - this.secondaryHeight;
            if (lines === 1) {
                this.textY = textboxHeight / 2 - 0.5 * lineHeight;
            } else {
                this.textY = textboxHeight * 0.6;
            }
        } else {
            const textboxHeight = this.height - this.secondaryHeight + this.useHeight;
            if (lines === 1) {
                this.textY = textboxHeight / 2 - 0.5 * lineHeight;
            } else {
                this.textY = textboxHeight * 0.625;
            }
        }
        this.text1Y = 0;
        this.text2Y = this.text1Y + 1.2 * lines * lineHeight;
    }

    private getText(startPosition: number): string {
        const style: CSSStyleDeclaration = {
            font: `${this.fontSize}px Helvetica`
        } as any;

        let result = '';
        let lastSpacePosition = 0;
        let textWider = false;

        for (let i = startPosition; i < this.text.length; i++) {
            const char = this.text[i];

            // skip space if result start with space
            if (char === ' ' && result === '') {
                continue;
            }

            const newText = result += char;
            const textWidth = getContentWidth(style, newText);

            if (char === ' ') {
                lastSpacePosition = i;
            }

            if (textWidth > this.textWidth) {
                textWider = true;
                break;
            }

            result = newText;
        }

        if (textWider && lastSpacePosition > 0 && lastSpacePosition < result.length) {
            result = result.substr(0, lastSpacePosition);
        } else if (this.fontSize === 11) {
            const cleanResult = result.replace(/ /g, '');
            const cleanText = this.text.substr(startPosition).replace(/ /g, '');
            if (cleanResult.length < cleanText.length) {
                result = result.substring(0, result.length - 3) + '...';
            }
        }

        return result;
    }

    private isFullTextVisible(): boolean {
        const visibleText = (this.text1 + this.text2).replace(/ /g, '');

        if (this.text2.endsWith('...')) {
            return true;
        }

        const textLength = this.text.replace(/ /g, '').length;

        return visibleText.length === textLength;
    }
}
