import { Component, OnInit, Input } from 'angular2/core';

@Component({
    selector: 'keyboard-button',
    template:
    `
         <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="width" [attr.height]="height" [attr.fill]="fill">
             <rect [id]="id" [attr.rx]="rx" [attr.ry]="ry" [attr.height]="height" [attr.width]="width"/>
         </svg>
     `,
    styles:
    [`
        :host {
           display: flex;
        }
    `],
})
export class KeyboardButtonComponent implements OnInit {
    @Input() id: string;
    @Input() rx: string;
    @Input() ry: string;
    @Input() height: string;
    @Input() width: string;
    @Input() fill: string;

    constructor() { }

    ngOnInit() { }

}