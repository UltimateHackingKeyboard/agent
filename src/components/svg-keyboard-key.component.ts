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
            [attr.text-anchor]="start"
            [attr.font-size]="19"
            [attr.font-family]="Helvetica"
            fill="#ffffff"
            *ngIf="asciiCode && asciiCode.length > 0">
                <tspan
                    x="0"
                    dy="0"
                    id="SvgjsTspan1180">{{asciiCode[0]}}</tspan>
         </svg:text>
     `
})
export class SvgKeyboardKeyComponent implements OnInit {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: string;
    @Input() width: string;
    @Input() asciiCode: string[];

    constructor() {
        this.asciiCode = [];
    }

    ngOnInit() { }

}
