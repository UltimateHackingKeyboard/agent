import {Component, ViewEncapsulation} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { SideMenuComponent } from '../components/side-menu';

@Component({
    selector: 'main-app',
    template: require('./main-app.component.html'),
    styles: [require('./main-app.component.scss')],
    directives: [SideMenuComponent, ROUTER_DIRECTIVES],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent  {
    constructor() {
    }
}
