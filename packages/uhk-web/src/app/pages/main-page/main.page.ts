import { Component } from '@angular/core';

@Component({
    selector: 'main-page',
    standalone: false,
    templateUrl: './main.page.html'
})
export class MainPage {

    constructor() {
    }

    onActivate(e: unknown, outlet: HTMLElement) {
        outlet.scrollIntoView();
    }
}
