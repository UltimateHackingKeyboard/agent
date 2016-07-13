import { Component, OnInit, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'g[svg-text-icon-key]',
    template: require('./svg-text-icon-key.component.html')
})
export class SvgTextIconKeyComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;
    @Input() text: string;
    @Input() icon: string;

    constructor() { }

    ngOnInit() { }

}
