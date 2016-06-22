import { Component, OnInit, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'icon',
    template:
    `
        <div [ngSwitch]="name">
            <span *ngSwitchCase="'option-vertical'" class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span>
            <i *ngSwitchCase="'square'" class="fa fa-square"></i>
            <i *ngSwitchCase="'mouse-pointer'" class="fa fa-mouse-pointer"></i>
            <i *ngSwitchCase="'clock'" class="fa fa-clock-o"></i>
            <i *ngSwitchCase="'trash'" class="glyphicon glyphicon-trash action--trash"></i>
            <i *ngSwitchCase="'pencil'" class="glyphicon glyphicon-pencil action--edit"></i>
            <i *ngSwitchCase="'question-circle'" class ="fa fa-question-circle"></i>
        </div>
    `,
    directives: [NgSwitch, NgSwitchCase],
    styles: [require('./icon.component.scss')]
})
export class IconComponent implements OnInit {

    @Input() name: string;

    constructor() { }

    ngOnInit() { }

}
