import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-single-icon-key]',
    template: require('./svg-single-icon-key.component.html')
})
export class SvgSingleIconKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;

    constructor() { }

    ngOnInit() { }
}
