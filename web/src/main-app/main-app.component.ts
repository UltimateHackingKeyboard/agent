import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'main-app',
    template: require('../shared/main-app/main-app.component.html'),
    styles: [require('../shared/main-app/main-app.component.scss')],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent { }
