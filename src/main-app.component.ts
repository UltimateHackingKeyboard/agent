import { Component, OnInit, AfterViewInit, Renderer, ViewChildren, QueryList, ElementRef} from 'angular2/core';

import {SvgKeyboardComponent} from './components/svg-keyboard.component';

@Component({
    selector: 'main-app',
    template:
    `   <div>
            <button #baseButton type="button" class="btn btn-default btn-lg btn-primary" (click)="selectLayer(0)">
                Base
            </button>
            <button #modButton type="button" class="btn btn-default btn-lg" (click)="selectLayer(1)">
                Mod
            </button>
            <button #fnButton type="button" class="btn btn-default btn-lg" (click)="selectLayer(2)">
                Fn
            </button>
            <button #mouseButton type="button" class="btn btn-default btn-lg" (click)="selectLayer(3)">
                Mouse
            </button>
        </div>
        <div>
            <svg-keyboard></svg-keyboard>
        </div>
    `,
    styles:
    [`
        :host {
            display: flex;
            flex-direction: column;
        }

        :host > div:first-child {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
        }

        button {
            margin: 2px;
        }

        :host > div:last-child {
            display: flex;
            flex: 5;
            justify-content: center;
        }

       :host > div:last-child > svg-keyboard {
           width: 80%;
       }
    `],
    directives: [SvgKeyboardComponent]
})
export class MainAppComponent implements OnInit, AfterViewInit {
    @ViewChildren('baseButton,modButton,fnButton,mouseButton')
    buttonsQueryList: QueryList<ElementRef>;

    private buttons: ElementRef[];
    private selectedLayerIndex: number;

    constructor(private renderer: Renderer) {
        this.buttons = [];
        this.selectedLayerIndex = -1;
    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.buttons = this.buttonsQueryList.toArray();
        this.selectedLayerIndex = 0;
    }

    /* tslint:disable:no-unused-variable */
    /* selectLayer is used in the template string */
    private selectLayer(index: number): void {
        /* tslint:enable:no-unused-variable */
        this.renderer.setElementClass(this.buttons[this.selectedLayerIndex].nativeElement, 'btn-primary', false);
        this.renderer.setElementClass(this.buttons[index].nativeElement, 'btn-primary', true);
        this.selectedLayerIndex = index;
    }

}
