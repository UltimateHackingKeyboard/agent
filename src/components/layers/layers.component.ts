import {Component, Output, EventEmitter, ElementRef, QueryList, ViewChildren, Renderer, Input} from '@angular/core';

@Component({
    selector: 'layers',
    template: require('./layers.component.html'),
    styles: [require('./layers.component.scss')]
})
export class LayersComponent {
    @Input() len: number;
    @Output() selected = new EventEmitter();
    @ViewChildren('baseButton,modButton,fnButton,mouseButton')
    buttonsQueryList: QueryList<ElementRef>;

    private buttons: ElementRef[];
    private selectedLayerIndex: number;

    constructor(private renderer: Renderer) {
        this.buttons = [];
        this.selectedLayerIndex = 0;
    }

    /* tslint:disable:no-unused-variable */
    private selectLayer(index: number) {
        if (index === this.selectedLayerIndex) {
            return;
        }

        this.buttons = this.buttonsQueryList.toArray();
        this.selected.emit({
            oldIndex: this.selectedLayerIndex,
            index: index
        });

        this.renderer.setElementClass(this.buttons[this.selectedLayerIndex].nativeElement, 'btn-primary', false);
        this.renderer.setElementClass(this.buttons[index].nativeElement, 'btn-primary', true);

        this.selectedLayerIndex = index;
    }
}
