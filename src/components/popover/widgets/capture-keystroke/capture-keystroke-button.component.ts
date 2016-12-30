import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CaptureService } from '../../../../services/capture.service';

@Component({
    selector: 'capture-keystroke-button',
    template: require('./capture-keystroke-button.component.html'),
    styles: [require('./capture-keystroke-button.component.scss')]
})
export class CaptureKeystrokeButtonComponent {
    @Output() capture = new EventEmitter<any>();

    private record: boolean;
    private first: boolean; // enable usage of Enter to start capturing

    constructor(private captureService: CaptureService) {
        this.record = false;
        this.captureService.initModifiers();
        this.captureService.populateMapping();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(e: KeyboardEvent) {
        if (this.record && !this.first) {
            e.preventDefault();
            this.saveScanCode();
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        const code: number = e.keyCode;
        const enter = 13;

        if (this.record) {
            e.preventDefault();
            e.stopPropagation();
            this.first = false;

            if (this.captureService.hasMap(code)) {
                this.saveScanCode(this.captureService.getMap(code));
            } else {
                this.captureService.setModifier((e.location === 1), code);
            }
        } else if (code === enter) {
            this.record = true;
            this.first = true;
        }
    }

    @HostListener('focusout')
    onFocusOut() {
        this.record = false;
        this.reset();
    }

    start(): void {
        this.record = true;
    }

    private saveScanCode(code?: number) {
        this.record = false;
        const left: boolean[] = this.captureService.getModifiers(true);
        const right: boolean[] = this.captureService.getModifiers(false);

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
    }
}
