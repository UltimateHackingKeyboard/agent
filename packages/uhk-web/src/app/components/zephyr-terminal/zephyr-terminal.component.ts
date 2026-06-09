import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { Subscription } from 'rxjs';
import {
    LogService,
    SHELL_COMMAND_TOO_LONG_ERROR,
    UhkDeviceProduct,
    UHK_DEVICE_IDS,
    ZephyrLogEntry,
} from 'uhk-common';

import { AppState } from '../../store';
import { ActionTypes as AdvancedSettingsActionTypes, ZephyrLogAction } from '../../store/actions/advance-settings.action';
import {
    ExecShellCommandOnDongleAction,
    ExecShellCommandOnLeftHalfAction,
    ExecShellCommandOnRightHalfAction,
} from '../../store/actions/device';

/**
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
export class ZephyrTerminalComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() uhkDevice: UhkDeviceProduct;
    @Input() zephyrLogs: ZephyrLogEntry[] = [];

    @ViewChild('terminal', { static: true }) terminalElement: ElementRef<HTMLDivElement>;

    private isLogRestored = false;
    private terminal: Terminal;
    private fitAddon: FitAddon;
    private logSubscription: Subscription;

    protected readonly faCopy = faCopy;

    constructor(
        private logService: LogService,
        private store: Store<AppState>,
        private actions$: Actions,
    ) {}

    ngAfterViewInit(): void {
        this.terminal = new Terminal({
            convertEol: false,
            fontFamily: 'JetBrains Mono',
            cursorBlink: true,
            scrollback: 10000,
        });
        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(this.terminalElement.nativeElement);
        setTimeout(() => {
            this.fitAddon.fit();
        }, 1);

        this.terminal.attachCustomKeyEventHandler((event) => {
            // Handle CTRL + SHIFT + C as copy to clipboard
            // It copies only the selected text.
            // Does not copy the whole terminal content when no text is selected like Copy To Clipboard icon
            if (event.ctrlKey && event.shiftKey && event.code === 'KeyC' && event.type === 'keydown') {
                const selection = this.terminal.getSelection();
                if (selection) {
                    navigator.clipboard.writeText(selection)
                        .catch((error) => {
                            this.logService.error('Failed to copy text to clipboard', error);
                        });

                    return false;
                }
            }
            // Handle CTRL + SHIFT + V as paste from clipboard
            else if (event.ctrlKey && event.shiftKey && event.code === 'KeyV' && event.type === 'keydown') {
                navigator.clipboard.readText()
                    .then((text) => {
                        this.dispatchTerminalInput(text);
                    })
                    .catch((error) => {
                        this.logService.error('Failed to paste text from clipboard', error);
                    });

                return false;
            }
            // Prevent double paste on Windows
            else if (event.ctrlKey && event.code === 'KeyV' && event.type === 'keydown') {
                return false;
            }

            return true;
        });

        // Forward every keystroke (raw bytes, incl. ESC sequences).
        this.terminal.onData((data: string) => {
            this.dispatchTerminalInput(data);
        });

        this.restoreLogHistory();

        // Write raw shell output coming from the right half straight into the terminal.
        this.logSubscription = this.actions$
            .pipe(ofType<ZephyrLogAction>(AdvancedSettingsActionTypes.zephyrLog))
            .subscribe((action: ZephyrLogAction) => {
                 if (action.payload.device === this.uhkDevice?.logName) {
                     if (action.payload.log === SHELL_COMMAND_TOO_LONG_ERROR) {
                         this.terminal.write(`\x1b[31m${action.payload.log}\x1b[0m\r\n`);
                         // dispatch Enter to show the termina prompt
                         this.dispatchEnter();
                     }
                     else {
                         this.terminal.write(action.payload.log);
                     }
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.zephyrLogs?.firstChange) {
            this.restoreLogHistory();
        }
    }

    ngOnDestroy(): void {
        this.logSubscription?.unsubscribe();
        this.terminal?.dispose();
    }

    getClipboardContent(): string {
        if (!this.terminal) {
            return '';
        }

        let text = this.terminal.getSelection();

        if (!text) {
            this.terminal.selectAll();
            text = this.terminal.getSelection();
            this.terminal.clearSelection();
        }

        // Trim the text to remove trailing new line characters when the text contains less rows than terminal rows
        return text.trim();
    }


    onResized() {
        this.fitAddon?.fit()
    }

    private dispatchEnter(): void {
        this.dispatchTerminalInput('\r\n');
    }

    private dispatchTerminalInput(data: string): void {
        switch (this.uhkDevice?.id) {
            case UHK_DEVICE_IDS.UHK_DONGLE: {
                this.store.dispatch(new ExecShellCommandOnDongleAction(data));
                break;
            }

            case UHK_DEVICE_IDS.UHK80_LEFT: {
                this.store.dispatch(new ExecShellCommandOnLeftHalfAction(data));
                break;
            }

            case UHK_DEVICE_IDS.UHK60V1_RIGHT:
            case UHK_DEVICE_IDS.UHK60V2_RIGHT:
            case UHK_DEVICE_IDS.UHK80_RIGHT: {
                this.store.dispatch(new ExecShellCommandOnRightHalfAction(data));
                break;
            }
        }
    }

    private restoreLogHistory(): void {
        if (this.terminal && this.uhkDevice && !this.isLogRestored) {
            this.isLogRestored = true;

            let foundHistory = false;

            for (const log of this.zephyrLogs) {
                if (log.device === this.uhkDevice.logName) {
                    this.terminal.write(log.log);
                    foundHistory = true;
                }
            }

            // initialize the terminal if no history found,
            // it will write the correct prompt
            if (!foundHistory) {
                this.dispatchEnter();
            }
        }
    }
}
