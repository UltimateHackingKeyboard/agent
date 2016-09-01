import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'icon',
    template: require('./icon.component.html'),
    styles: [require('./icon.component.scss')]
})
export class IconComponent implements OnInit {

    @Input() name: string;

    constructor() { }

    ngOnInit() { }

}
