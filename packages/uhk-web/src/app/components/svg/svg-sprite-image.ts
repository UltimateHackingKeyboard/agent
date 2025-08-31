import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'svg-sprite-image',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    template: `
        <svg viewBox="0 0 16 16" height="1em" preserveAspectRatio="xMidYMin">
            <svg:use [attr.xlink:href]="icon">
            </svg:use>
        </svg>
    `,
    styles: [`
        :host {
            display: inline;
        }

        svg {
            margin-top:auto;
            margin-bottom:auto;
            fill: currentColor;
        }
    `]
})
export class SvgSpriteImage {
    @Input() icon: string;
}
