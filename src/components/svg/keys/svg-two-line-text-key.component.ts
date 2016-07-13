import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-two-line-text-key]',
    template: require('./svg-two-line-text-key.component.html')
})
export class SvgTwoLineTextKeyComponent implements OnInit {
    @Input() height: number;
    @Input() width: number;
    @Input() texts: string[];

    constructor() { }

    ngOnInit() { }
}
