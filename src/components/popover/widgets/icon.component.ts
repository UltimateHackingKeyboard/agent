import { Component, OnInit, Input } from '@angular/core';
import { NgSwitch, NgSwitchWhen } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'icon',
    template:
    `
        <div [ngSwitch]="name">
            <span *ngSwitchWhen="'option-vertical'" class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span>
            <i *ngSwitchWhen="'square'" class="fa fa-square"></i>
            <i *ngSwitchWhen="'mouse-pointer'" class="fa fa-mouse-pointer"></i>
            <i *ngSwitchWhen="'clock'" class="fa fa-clock-o"></i>
            <i *ngSwitchWhen="'trash'" class="glyphicon glyphicon-trash action--trash"></i>
            <i *ngSwitchWhen="'pencil'" class="glyphicon glyphicon-pencil action--edit"></i>
            <i *ngSwitchWhen="'question-circle'" class ="fa fa-question-circle"></i>
        </div>
    `,
    directives: [NgSwitch, NgSwitchWhen],
    styles: [require('./icon.component.scss')]
})
export class IconComponent implements OnInit {

    @Input() name: string;

    constructor() { }

    ngOnInit() { }

}
