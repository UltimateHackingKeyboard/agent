import { Component, OnInit, Input } from 'angular2/core';

@Component({
    selector: 'g[svg-keyboard-key]',
    template:
    `
        <svg:rect [id]="id" [attr.rx]="rx"          [attr.ry]="ry"
                            [attr.height]="height"  [attr.width]="width"
                            [attr.fill]="fill"
        />
     `
})
export class SvgKeyboardKeyComponent implements OnInit {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: string;
    @Input() width: string;

    constructor() { }

    ngOnInit() { }

}
