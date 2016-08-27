import {
    Component, Output, EventEmitter, ElementRef, QueryList, ViewChildren, Renderer, Input
} from '@angular/core';

@Component({
    selector: 'layers',
    template: require('./layers.component.html'),
    styles: [require('./layers.component.scss')]
})
export class LayersComponent {
    @Input() current: number;
    @Output() selected = new EventEmitter();

    @ViewChildren('baseButton,modButton,fnButton,mouseButton')
    buttonsQueryList: QueryList<ElementRef>;

    private buttons: ElementRef[];
    private selectedLayerIndex: number;

    constructor(private renderer: Renderer) {
        this.buttons = [];
        this.selectedLayerIndex = 0;
    }

    ngOnChanges() {
        if (this.buttons.length > 0 && this.current !== this.selectedLayerIndex) {
            this.buttons.forEach((button: ElementRef) => {
                this.renderer.setElementClass(button.nativeElement, 'btn-primary', false);
            });
            this.renderer.setElementClass(this.buttons[this.current].nativeElement, 'btn-primary', true);
            this.selectedLayerIndex = 0;
        }
    }

    selectLayer(index: number) {
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
