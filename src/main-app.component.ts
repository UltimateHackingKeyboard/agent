import { Component, OnInit } from 'angular2/core';

import {SvgKeyboardComponent} from './components/svg-keyboard.component';

@Component({
    selector: 'main-app',
    template: '<svg-keyboard></svg-keyboard>',
    directives: [SvgKeyboardComponent]
})
export class MainAppComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
