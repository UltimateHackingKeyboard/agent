import { Component, ViewChildren, QueryList, ElementRef, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SvgKeyboardPopoverComponent } from '../svg/popover/svg-keyboard-popover.component';
import { Layers } from '../../../config-serializer/config-items/Layers';
import { UhkConfigurationService } from '../../services/uhk-configuration.service';
import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'keymap',
    template: require('./keymap.component.html'),
    styles: [require('./keymap.component.scss')],
    directives: [SvgKeyboardPopoverComponent],
    providers: [UhkConfigurationService]
})
export class KeymapComponent implements OnInit, AfterViewInit {
    @ViewChildren('baseButton,modButton,fnButton,mouseButton')
    buttonsQueryList: QueryList<ElementRef>;

    @ViewChildren(SvgKeyboardPopoverComponent, { read: ElementRef })
    keyboardsQueryList: QueryList<ElementRef>;

    private buttons: ElementRef[];
    private keyboards: ElementRef[];
    private selectedLayerIndex: number;
    private keymapId: number = 0;

    private layers: Layers;
    private keymap: Keymap;

    private numAnimationInProgress: number;
    private subParams: Subscription;
    private subQuery: Subscription;

    constructor(
        private renderer: Renderer,
        private uhkConfigurationService: UhkConfigurationService,
        private route: ActivatedRoute
    ) {
        this.buttons = [];
        this.keyboards = [];
        this.selectedLayerIndex = 0;
        this.numAnimationInProgress = 0;
    }

    ngOnInit() {
        this.subParams = this.route.params.subscribe(params => {
            let id: number = +params['id'];

            if (!isNaN(id)) {
                this.keymapId = id;
            }

            this.keymap = this.uhkConfigurationService.getUhkConfiguration().keymaps.elements[this.keymapId];
            this.layers = this.keymap.layers;
        });
    }

    ngAfterViewInit() {
        this.buttons = this.buttonsQueryList.toArray();
        this.afterView();

        this.subQuery = this.keyboardsQueryList.changes.subscribe(() => {
            this.afterView();
        });
    }

    ngOnDestroy() {
        this.subParams.unsubscribe();
        this.subQuery.unsubscribe();
    }

    private afterView() {
        this.keyboards = this.keyboardsQueryList.toArray();
        this.renderer.setElementAttribute(this.keyboards[0].nativeElement, 'hidden', undefined);
        this.renderer.setElementClass(this.buttons[this.selectedLayerIndex].nativeElement, 'btn-primary', false);
        this.renderer.setElementClass(this.buttons[0].nativeElement, 'btn-primary', true);
        this.selectedLayerIndex = 0;
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
