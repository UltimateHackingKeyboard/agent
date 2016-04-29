import { Component, OnInit, Input } from 'angular2/core';

@Component({
    selector: 'g[svg-keyboard-key]',
    template:
    `
        <svg:rect [id]="id" [attr.rx]="rx"          [attr.ry]="ry"
                            [attr.height]="height"  [attr.width]="width"
                            [attr.fill]="fill"
        />
         <svg:text
            [attr.x]="0"
            [attr.y]="height/2"
            [attr.text-anchor]="'middle'"
            [attr.font-size]="19"
            [attr.font-family]="'Helvetica'"
            [attr.fill]="'#ffffff'"
            [attr.style]="'dominant-baseline: central'"
            *ngIf="labels && labels.length > 0">
                <tspan
                    [attr.x]="width / 2"
                    dy="0"
                    id="SvgjsTspan1180">{{ labels[0] }}</tspan>
         </svg:text>
     `
})
export class SvgKeyboardKeyComponent implements OnInit {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: string;
    @Input() width: string;
    @Input() labels: string[];

    constructor() {
        this.labels = [];
    }

    ngOnInit() { }

}
