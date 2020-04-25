import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';

import { Observable } from 'rxjs';
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
    faPuzzlePiece = faPuzzlePiece;

    constructor(route: ActivatedRoute) {
        this.name$ = route
            .params
            .pipe(
                pluck<{}, string>('name')
            );
    }
}
