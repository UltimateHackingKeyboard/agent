import { Component, OnInit, AfterViewInit, Renderer, ViewChildren, QueryList, ElementRef} from '@angular/core';

import {Layers} from '../config-serializer/config-items/Layers';

import {SvgKeyboardPopoverComponent} from './components/svg-keyboard-popover.component';
import {UhkConfigurationService} from './services/uhk-configuration.service';
import {LegacyLoaderComponent} from './components/legacy/legacy-loader.component';

@Component({
    moduleId: module.id,
    selector: 'main-app',
    template:
    `   
        <div class="keymap--edit-ng2 main-content__inner" style="height: 100%; width: 100%;">
            <div class="row">
                <h1 class="col-xs-12 pane-title">
                    <i class="fa fa-keyboard-o"></i>
                    <span class="keymap__name pane-title__name" contenteditable="true">QWERTY</span> keymap
                    (<span class="keymap__abbrev pane-title__abbrev" contenteditable="true">QTY</span>)
                    <i class="fa fa-star-o fa-star keymap__is-default"></i>
                    <i class="glyphicon glyphicon-trash keymap__remove pull-right" title="" 
                        data-toggle="tooltip" data-placement="left" data-original-title="Remove keymap"></i>
                </h1>
            </div>
            <div class="row uhk--wrapper">
                <div class="col-xs-12 text-center">
                    <span class="uhk__layer-switcher--wrapper" data-title="Layers: ">
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
                    </span>
                </div>
                <div class="keyboard-slider">
                    <svg-keyboard-popover *ngFor="let layer of layers.elements"
                                    [moduleConfig]="layer.modules.elements"
                                    (animationend)="onKeyboardAnimationEnd($event)"
                                    hidden>
                    </svg-keyboard-popover>
                </div>
            </div>
       </div>
       <legacy [link]="'keymapLegacy.html'" [class]="'keymap-legacy--edit'"></legacy>
       <legacy [link]="'macroLegacy.html'" [class]="'macro-legacy--edit'"></legacy>
    `,
    styles: [require('./main-app.component.scss')],
    directives: [SvgKeyboardPopoverComponent, LegacyLoaderComponent],
    providers: [UhkConfigurationService]
})
export class MainAppComponent implements OnInit, AfterViewInit {
    @ViewChildren('baseButton,modButton,fnButton,mouseButton')
    buttonsQueryList: QueryList<ElementRef>;

    @ViewChildren(SvgKeyboardPopoverComponent, { read: ElementRef })
    keyboardsQueryList: QueryList<ElementRef>;

    private buttons: ElementRef[];
    private keyboards: ElementRef[];
    private selectedLayerIndex: number;

    private layers: Layers;

    private numAnimationInProgress: number;

    constructor(
        private renderer: Renderer,
        private uhkConfigurationService: UhkConfigurationService
    ) {
        this.buttons = [];
        this.keyboards = [];
        this.selectedLayerIndex = -1;
        this.numAnimationInProgress = 0;
    }

    ngOnInit() {
        this.layers = this.uhkConfigurationService.getUhkConfiguration().keymaps.elements[0].layers;
    }

    ngAfterViewInit() {
        this.buttons = this.buttonsQueryList.toArray();
        this.keyboards = this.keyboardsQueryList.toArray();
        this.selectedLayerIndex = 0;
        this.renderer.setElementAttribute(this.keyboards[0].nativeElement, 'hidden', undefined);
    }

    /* tslint:disable:no-unused-variable */
    /* selectLayer is used in the template string */
    private selectLayer(index: number): void {
        /* tslint:enable:no-unused-variable */
        if (this.selectedLayerIndex === index || index > this.keyboards.length - 1 || this.numAnimationInProgress > 0) {
            return;
        }

        this.renderer.setElementClass(this.buttons[this.selectedLayerIndex].nativeElement, 'btn-primary', false);
        this.renderer.setElementClass(this.buttons[index].nativeElement, 'btn-primary', true);

        if (index > this.selectedLayerIndex) {
            this.renderer.setElementStyle(
                this.keyboards[this.selectedLayerIndex].nativeElement,
                'animation-name',
                'animate-center-left'
            );
            this.renderer.setElementStyle(
                this.keyboards[index].nativeElement,
                'animation-name',
                'animate-center-right'
            );
            this.renderer.setElementStyle(this.keyboards[index].nativeElement, 'animation-direction', 'reverse');
        } else {
            this.renderer.setElementStyle(
                this.keyboards[this.selectedLayerIndex].nativeElement,
                'animation-name',
                'animate-center-right'
            );
            this.renderer.setElementStyle(this.keyboards[index].nativeElement, 'animation-name', 'animate-center-left');
            this.renderer.setElementStyle(this.keyboards[index].nativeElement, 'animation-direction', 'reverse');
        }
        this.numAnimationInProgress += 2;

        this.renderer.setElementAttribute(this.keyboards[index].nativeElement, 'hidden', undefined);

        this.selectedLayerIndex = index;
    }

    /* tslint:disable:no-unused-variable */
    /* onKeyboardAnimationEnd is used in the template string */
    private onKeyboardAnimationEnd(event: AnimationEvent) {
        /* tslint:enable:no-unused-variable */
        let animationNameTokens: string[] = event.animationName.split('-');
        let animationFrom: string = animationNameTokens[1];
        let animationTo: string = animationNameTokens[2];
        if ((<HTMLElement> event.target).style.animationDirection === 'reverse') {
            animationFrom = animationNameTokens[2];
            animationTo = animationNameTokens[1];
            this.renderer.setElementStyle(event.target, 'animation-direction', undefined);
        }

        --this.numAnimationInProgress;
        this.renderer.setElementStyle(event.target, 'animation-name', undefined);
        this.renderer.setElementAttribute(event.target, 'hidden', (animationTo === 'center') ? undefined : '');
    }

}
