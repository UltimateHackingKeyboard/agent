import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'main-app',
    template: require('./main-app.component.html'),
    styles: [require('./main-app.component.scss')],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent { }
