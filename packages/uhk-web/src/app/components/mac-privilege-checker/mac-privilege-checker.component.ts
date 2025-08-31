import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mac-privilege-checker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    templateUrl: './mac-privilege-checker.component.html',
    styleUrls: ['./mac-privilege-checker.component.scss']
})
export class MacPrivilegeCheckerComponent {

}
