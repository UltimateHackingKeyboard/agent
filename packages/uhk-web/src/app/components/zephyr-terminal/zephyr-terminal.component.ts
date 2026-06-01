import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { Subscription } from 'rxjs';
import { UHK_80_DEVICE } from 'uhk-common';

import { AppState } from '../../store';
import { ActionTypes as AdvancedSettingsActionTypes, ZephyrLogAction } from '../../store/actions/advance-settings.action';
import { ExecShellCommandOnRightHalfAction } from '../../store/actions/device';

/**
 * Proof-of-concept VT100 terminal for the UHK 80 right half.
 *
 * Output: the raw shell buffer chunks emitted by the right-half poller (device === UHK 80 right)
 * are written verbatim to xterm.js, so colors and cursor control render.
 *
 * Input: every keystroke (incl. ESC sequences for arrows, Tab, Ctrl-C, Enter) is forwarded to the
 * device through the ExecShellCommand byte channel. Echo and history are produced by the firmware's
 * shell, so they only light up once the firmware injects these bytes into the interactive shell
 * input. NUL (0x00) is the only byte the transport can't carry, and VT100 treats NUL as ignorable
 * fill, so nothing meaningful is lost.
 */
@Component({
    selector: 'zephyr-terminal',
    standalone: false,
    templateUrl: './zephyr-terminal.component.html',
    styleUrls: ['./zephyr-terminal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZephyrTerminalComponent implements AfterViewInit, OnDestroy {
    @ViewChild('terminal', { static: true }) terminalElement: ElementRef<HTMLDivElement>;

    private terminal: Terminal;
    private fitAddon: FitAddon;
    private logSubscription: Subscription;
    private resizeObserver: ResizeObserver;

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
    ) {}

    ngAfterViewInit(): void {
        this.terminal = new Terminal({
            convertEol: false,
            fontFamily: 'monospace',
            cursorBlink: true,
            scrollback: 10000,
        });
        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(this.terminalElement.nativeElement);
        this.fitAddon.fit();

        // Forward every keystroke (raw bytes, incl. ESC sequences) to the right half.
        this.terminal.onData((data: string) => {
            this.store.dispatch(new ExecShellCommandOnRightHalfAction(data));
        });

        // Write raw shell output coming from the right half straight into the terminal.
        this.logSubscription = this.actions$
            .pipe(ofType<ZephyrLogAction>(AdvancedSettingsActionTypes.zephyrLog))
            .subscribe((action: ZephyrLogAction) => {
                if (action.payload.device === UHK_80_DEVICE.logName) {
                    this.terminal.write(action.payload.log);
                }
            });

        this.resizeObserver = new ResizeObserver(() => this.fitAddon.fit());
        this.resizeObserver.observe(this.terminalElement.nativeElement);
    }

    ngOnDestroy(): void {
        this.logSubscription?.unsubscribe();
        this.resizeObserver?.disconnect();
        this.terminal?.dispose();
    }
}
