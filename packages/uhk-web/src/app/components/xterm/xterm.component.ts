import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { XtermLog } from '../../models/xterm-log';

@Component({
    selector: 'xterm',
    templateUrl: './xterm.component.html',
    styleUrls: ['./xterm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XtermComponent implements OnChanges {
    @Input() logs: Array<XtermLog> = [];

    @ViewChild('scrollMe') divElement: ElementRef;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.logs && this.divElement && this.divElement.nativeElement) {
            setTimeout(() => {
                this.divElement.nativeElement.scrollTop = this.divElement.nativeElement.scrollHeight;
            });
        }
    }

    getClipboardContent(): string {
        return this.logs.reduce((value, line) => value + line.message + '\n', '');
    }
}
