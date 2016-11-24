import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'add-on',
    template: require('./add-on.component.html'),
    styles: [require('./add-on.component.scss')],
    host: {
        'class': 'container-fluid'
    }
})
export class AddOnComponent {
    private name$: Observable<string>;

    constructor(private route: ActivatedRoute) {
        this.name$ = route
            .params
            .select<string>('name');
    }
}
