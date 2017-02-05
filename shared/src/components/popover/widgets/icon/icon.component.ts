import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

    @Input() name: string;

    constructor() { }

    ngOnInit() { }

}
