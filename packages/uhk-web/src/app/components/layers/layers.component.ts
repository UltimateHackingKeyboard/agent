import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'layers',
    templateUrl: './layers.component.html',
    styleUrls: ['./layers.component.scss']
})
export class LayersComponent {
    @Input() current: number;
    @Output() select = new EventEmitter();

    buttons: string[];

    constructor() {
        this.buttons = ['Base', 'Mod', 'Fn', 'Mouse'];
        this.current = 0;
    }

    selectLayer(index: number) {
        if (this.current === index) {
            return;
        }

        this.select.emit({
            oldIndex: this.current,
            index: index
        });

        this.current = index;
    }
}
