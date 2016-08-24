import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'capture-keystroke-button',
    template: require('./capture-keystroke-button.component.html'),
    styles: [require('./capture-keystroke-button.component.scss')]
})
export class CaptureKeystrokeButtonComponent implements OnInit {
    private record: boolean;

    constructor() { }

    ngOnInit() { }

    start(): void {
        this.record = true;
    }

    stop(): void {
        this.record = false;
    }

}
