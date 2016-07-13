import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-icon-text-key]',
    template: require('./svg-icon-text-key.component.html')
})
export class SvgIconTextKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() icon: string;
    @Input() text: string;

    constructor() { }

    ngOnInit() { }

}
