import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
    selector: 'privilige-checker',
    templateUrl: 'privilige-checker.component.html',
    styleUrls: ['privilige-checker.component.scss']
})
export class PriviligeCheckerComponent {

    constructor(router: Router) {
        this.checkPermissions()
            .subscribe(hasPermisson => {
                if (hasPermisson) {
                    router.navigate(['/privilige']);
                }
            });
    }

    checkPermissions(): Observable<boolean> {
        return Observable.of(true);
    }

    setUpPermissions() { }

}
