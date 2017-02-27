import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
    selector: 'privilege-checker',
    templateUrl: 'privilege-checker.component.html',
    styleUrls: ['privilege-checker.component.scss']
})
export class PrivilegeCheckerComponent {

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
