import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { XtermLog } from '../../models/xterm-log';

@Component({
    selector: 'xterm',
    templateUrl: './xterm.component.html',
    styleUrls: ['./xterm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class XtermComponent implements OnChanges {
    @Input() logs: Array<XtermLog> = [];

    @ViewChild('scrollMe', { static: false }) divElement: ElementRef;

    faCopy = faCopy;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.logs) {
            this.scrollToTheEnd();
        }
    }

    getClipboardContent(): string {
        return this.logs.reduce((value, line) => value + line.message + '\n', '');
    }

    scrollToTheEnd(): void {
        setTimeout(() => {
            if (this.divElement && this.divElement.nativeElement) {
                this.divElement.nativeElement.scrollTop = this.divElement.nativeElement.scrollHeight;
            }
        });
    }
}
