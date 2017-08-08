import { Component } from '@angular/core';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/takeWhile';

@Component({
    selector: 'missing-device',
    templateUrl: './missing-device.component.html'
})
export class MissingDeviceComponent {

    constructor() {}
}
