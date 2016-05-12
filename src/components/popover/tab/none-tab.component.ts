import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'none-tab',
    template: `This key is unassigned and has no functionality.`,
    styles:
    [`
        :host {
            display: flex;
            justify-content: center;
            padding: 2rem 0;
        }
    `]
})
export class NoneTabComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
