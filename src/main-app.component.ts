import { Component, OnInit } from 'angular2/core';

import {KeyboardComponent} from './components/keyboard.component';

@Component({
    selector: 'main-app',
    template: '<keyboard></keyboard>',
    directives: [KeyboardComponent]
})
export class MainAppComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
