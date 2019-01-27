import { Component } from '@angular/core';

@Component({
    selector: 'main-page',
    templateUrl: './main.page.html',
    styles: [':host{height:100%; width:100%}']
})
export class MainPage {
    constructor() {}

    onActivate(e, outlet) {
        outlet.scrollIntoView();
    }
}
