import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { Key } from 'ts-keycode-enum';

import { CaptureService } from '../../../../services/capture.service';
import { KeyModifierModel } from '../../../../models/key-modifier-model';
import { AppState } from '../../../../store';
import { StartKeypressCapturingAction, StopKeypressCapturingAction } from '../../../../store/actions/app';

@Component({
    selector: 'capture-keystroke-button',
    templateUrl: './capture-keystroke-button.component.html',
    styleUrls: ['./capture-keystroke-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaptureKeystrokeButtonComponent {
    @Input() isLink = false;
    @Input() captureText = 'Capture keystroke';
    @Output() capture = new EventEmitter<any>();

    record: boolean;
    private first: boolean; // enable usage of Enter to start capturing
    private scanCodePressed: boolean;

    constructor(private captureService: CaptureService, private store: Store<AppState>) {
        this.record = false;
        this.captureService.initModifiers();
        this.captureService.populateMapping();
        this.scanCodePressed = false;
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(e: KeyboardEvent) {
        if (this.scanCodePressed) {
            e.preventDefault();
            e.stopPropagation();
            this.scanCodePressed = false;
        } else if (this.record && !this.first) {
            e.preventDefault();
            e.stopPropagation();
            this.saveScanCode();
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        const code: number = e.keyCode;

        if (this.record) {
            e.preventDefault();
            e.stopPropagation();
            this.first = false;

            if (this.captureService.hasMap(code)) {
                this.saveScanCode(this.captureService.getMap(code));
                this.scanCodePressed = true;
            } else {
                this.captureService.setModifier(e.location === 1, code);
            }
        } else if (code === Key.Enter) {
            this.record = true;
            this.first = true;
            this.store.dispatch(new StartKeypressCapturingAction());
        }
    }

    @HostListener('focusout')
    onFocusOut() {
        this.record = false;
        this.reset();
    }

    start(): void {
        this.record = true;
        this.store.dispatch(new StartKeypressCapturingAction());
    }

    private saveScanCode(code?: number) {
        this.record = false;
        const left: KeyModifierModel[] = this.captureService.getModifiers(true);
        const right: KeyModifierModel[] = this.captureService.getModifiers(false);

        this.capture.emit({
            code,
            left,
            right
        });

        this.reset();
    }

    private reset() {
        this.first = false;
        this.captureService.initModifiers();
        this.store.dispatch(new StopKeypressCapturingAction());
    }
}
