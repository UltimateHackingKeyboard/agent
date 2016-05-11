import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'capture-keystroke-button',
    template:
    `
     <button type="button" class="btn btn-sm btn--capture-keystroke"
                [ngClass]="{'btn-default': !record, 'btn-info': record}"
                (click)="record ? stop() : start()">
        <i class="fa" [ngClass]=" { 'fa-circle' : !record, 'fa-square': record }"></i>
        <template [ngIf]="!record">
            Capture keystroke
        </template>
        <template [ngIf]="record">
            Stop capturing
        </template>
     </button>
    `,
    styles:
    [`
        button {
            display: inline-block;
            margin: 0 0 0 .25rem;
        }

        .fa-circle {
            color:#c00;
        }
    `]
})
export class CaptureKeystrokeButtonComponent implements OnInit {
    private record: boolean;

    constructor() { }

    ngOnInit() { }

    private start(): void {
        this.record = true;
    }

    private stop(): void {
        this.record = false;
    }

}
