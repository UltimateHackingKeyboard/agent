import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as xterm from 'xterm';

@Component({
    selector: 'xterm',
    templateUrl: './xterm.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class XtermComponent {
    @Input() logs: Array<string> = [];
}
