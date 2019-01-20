import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { pluck } from 'rxjs/operators';

@Component({
    selector: 'add-on',
    templateUrl: './add-on.component.html',
    styleUrls: ['./add-on.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class AddOnComponent {
    name$: Observable<string>;

    constructor(route: ActivatedRoute) {
        this.name$ = route
            .params
            .pipe(
                pluck<{}, string>('name')
            );
    }
}
