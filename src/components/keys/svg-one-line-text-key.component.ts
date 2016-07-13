import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-one-line-text-key]',
    template: require('./svg-one-line-text-key.component.html')
})
export class SvgOneLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() text: string;

    constructor() { }

    ngOnInit() { }

}
