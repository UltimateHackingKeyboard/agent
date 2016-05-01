import { Component, OnInit, AfterViewInit, Renderer, ViewChildren, QueryList, ElementRef} from 'angular2/core';

import {UhkConfiguration} from '../config-serializer/config-items/UhkConfiguration';
import {Layers} from '../config-serializer/config-items/Layers';

import {SvgKeyboardComponent} from './components/svg-keyboard.component';
import {SvgModule} from './components/svg-module.model';

import {DataProviderService} from './services/data-provider.service';

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
            <svg-keyboard *ngFor="let layer of layers.elements"
                            [svgAttributes]="svgAttributes"
                            [modules]="modules"
                            [moduleConfig]="layer.modules.elements"
                            (animationend)="onKeyboardAnimationEnd($event)"
                            hidden>
            </svg-keyboard>
        </div>
    `,
    styles:
    [`
        :host {
            display: flex;
            flex-direction: column;
            overflow: hidden;
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
            position: relative;
        }

       :host > div:last-child > svg-keyboard {
           width: 80%;
           position: absolute;
           left: 50%;
           transform: translateX(-50%);
           animation-duration: 0.75s;
           animation-timing-function: ease-in-out;
       }

        @keyframes animate-center-left {
            0% {
                transform: translateX(-50%);
                left: 50%;
            }
            100% {
                transform: translateX(-100%);
                left: 0%;
            }
        }

        @keyframes animate-center-right {
            0% {
                transform: translateX(-50%);
                left: 50%;
            }
            100% {
                transform: translateX(0%);
                left: 100%;
            }
        }

        [hidden] {
            display: none
        }

    `],
    directives: [SvgKeyboardComponent]
})
export class MainAppComponent implements OnInit, AfterViewInit {
    @ViewChildren('baseButton,modButton,fnButton,mouseButton')
    buttonsQueryList: QueryList<ElementRef>;

    @ViewChildren(SvgKeyboardComponent, { read: ElementRef })
    keyboardsQueryList: QueryList<ElementRef>;

    private buttons: ElementRef[];
    private keyboards: ElementRef[];
    private selectedLayerIndex: number;

    private svgAttributes: { viewBox: string, transform: string, fill: string };
    private modules: SvgModule[];
    private layers: Layers;

    private numAnimationInProgress: number;

    constructor(private renderer: Renderer, private dps: DataProviderService) {
        this.buttons = [];
        this.keyboards = [];
        this.selectedLayerIndex = -1;
        this.numAnimationInProgress = 0;
    }

    ngOnInit() {
        let svg: any = this.dps.getBaseLayer();
        this.svgAttributes = {
            viewBox: svg.$.viewBox,
            transform: svg.g[0].$.transform,
            fill: svg.g[0].$.fill
        };
        this.modules = svg.g[0].g.map(obj => new SvgModule(obj));
        this.modules = [this.modules[1], this.modules[0]]; // TODO: remove if the svg will be correct

        let uhkConfig: UhkConfiguration = new UhkConfiguration();
        uhkConfig.fromJsObject(this.dps.getUHKConfig());
        this.layers = uhkConfig.keyMaps.elements[0].layers;

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
