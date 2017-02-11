import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'main-app',
    templateUrl: './main-app.component.html',
    styleUrls: [
        '../shared/main-app/main-app.component.scss',
        './main-app.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent { }
