import { Component } from '@angular/core';

@Component({
    selector: 'main-page',
    templateUrl: './main.page.html'
})
export class MainPage {

    constructor() {
    }

    onActivate(e, outlet) {
        outlet.scrollIntoView();
    }
}
