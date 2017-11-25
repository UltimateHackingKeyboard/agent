import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XtermLog } from '../../models/xterm-log';

@Component({
    selector: 'xterm',
    templateUrl: './xterm.component.html',
    styleUrls: ['./xterm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class XtermComponent {
    @Input() logs: Array<XtermLog> = [];
}
