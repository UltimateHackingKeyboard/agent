import { Component, OnInit, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'icon',
    template: require('./icon.component.html'),
    styles: [require('./icon.component.scss')],
    directives: [NgSwitch, NgSwitchCase]
})
export class IconComponent implements OnInit {

    @Input() name: string;

    constructor() { }

    ngOnInit() { }

}
