import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HalvesInfo, Keymap } from 'uhk-common';

import { AppState, getHalvesInfo, getSelectedKeymap } from '../store';
import { ExchangeKeysActionModel } from '../models';
import { ExchangeKeysAction } from '../store/actions/keymap';

interface Point {
    x: number;
    y: number;
}

export interface LeftButtonDownOptions {
    keyId: string;
    event: MouseEvent;
    element: SVGGElement;
}

/**
 * Minimum mouse move in pixel before start the dragging;
 */
const MIN_MOVE_TO_START_DRAG = 2;
const SVG_CLONED_ELEMENT_ID = 'svg-cloned-element';
const SVG_DISPLAY_ELEMENT_CLASSES = ['svg-circle', 'svg-path', 'svg-rec'];

@Injectable()
export class KeyActionDragAndDropService implements OnDestroy {

    private isLeftButtonDown = false;
    private dragging = false;
    private lefButtonDownOptions: LeftButtonDownOptions;
    private leftButtonUpEvent: MouseEvent;
    private svgWrapper: SVGElement;
    private dropElement: Element;
    private keymap: Keymap;
    private subscriptions = new Subscription();
    private moduleId: number;
    private halvesInfo: HalvesInfo;
    private scale = 1;
    private rect: DOMRect;
    private offset: Point = {
        x: 0,
        y: 0
    };

    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _store: Store<AppState>
    ) {
        this._document.addEventListener('mouseup', this.leftButtonUp.bind(this));
        this._document.addEventListener('mousemove', this.mouseMove.bind(this));
        this.subscriptions.add(this._store.select(getSelectedKeymap).subscribe(keymap => this.keymap = keymap));
        this.subscriptions.add(this._store.select(getHalvesInfo).subscribe(info => this.halvesInfo = info));
    }

    ngOnDestroy(): void {
        this._document.removeEventListener('mouseup', this.leftButtonUp);
        this._document.removeEventListener('mousemove', this.mouseMove);
        this.subscriptions.unsubscribe();
    }

    leftButtonDown(options: LeftButtonDownOptions): void {
        this.lefButtonDownOptions = options;
        this.isLeftButtonDown = true;
        this.rect = this.lefButtonDownOptions.element.getBoundingClientRect();
    }

    leftButtonUp(event: MouseEvent): void {
        if (!this.isLeftButtonDown) {
            return;
        }

        this.leftButtonUpEvent = event;
        this.drop();
        this.isLeftButtonDown = false;
        this.lefButtonDownOptions = undefined;
        this.leftButtonUpEvent = undefined;
        this.dragging = false;
        this.moduleId = undefined;
    }

    mouseMove(event: MouseEvent): void {
        if (!this.isLeftButtonDown) {
            return;
        }

        if (!this.dragging && !this.isMovedMinimum(event)) {
            return;
        }

        this.detectDropKeyElement(event);
        this.dragElement();
        this.setSvgWrapperTransformation(this.dropElement);

        this.svgWrapper.style.left = event.clientX + this.offset.x + 'px';
        this.svgWrapper.style.top = event.clientY + this.offset.y + 'px';
    }

    private detectDropKeyElement(event: MouseEvent): void {
        const elements = this._document.elementsFromPoint(event.clientX, event.clientY);

        let foundElement: Element;
        let svgClonedSkipped = false;
        for (const element of elements) {
            if (!svgClonedSkipped && element.id === SVG_CLONED_ELEMENT_ID) {
                svgClonedSkipped = true;
            } else if (isDropElement(element) &&
                svgClonedSkipped
            ) {
                let parent = element.parentElement;

                while (parent) {
                    if (parent !== this.lefButtonDownOptions.element as any &&
                        parent.hasAttribute('svg-keyboard-key')
                    ) {
                        foundElement = parent;
                        break;
                    }

                    parent = parent.parentElement;
                }
            }
        }

        this.removeActiveCssFromDropElement();
        this.dropElement = foundElement;

        if (foundElement) {
            this.addActiveCssFromDropElement();
        }
    }

    private addActiveCssFromDropElement(): void {
        this.dropElement.classList.add('active');
    }

    private removeActiveCssFromDropElement(): void {
        if (!this.dropElement) {
            return;
        }

        this.dropElement.classList.remove('active');
    }

    private dragElement(): void {
        if (this.dragging) {
            return;
        }
        const translateKey = 2;
        this.scale = this._document.getElementById('svg-keyboard-a').offsetWidth / 1100;
        const box = this.lefButtonDownOptions.element.getBBox();
        const width = box.width < 63 ? 63 : box.width;
        const height = box.height;

        const clonedElement = this.lefButtonDownOptions.element.cloneNode(true) as SVGElement;
        clonedElement.classList.remove('active');
        clonedElement.setAttribute('dragging', 'true');
        if (box.width < 63) {
            const translateX = translateKey + Math.abs(box.x) + 31.5 - box.width / 2;
            clonedElement.setAttribute('transform', `translate(${translateX},${translateKey + Math.abs(box.y)})`);
        } else {
            clonedElement.setAttribute('transform', `translate(${translateKey + Math.abs(box.x)},${translateKey + Math.abs(box.y)})`);
        }

        this.lefButtonDownOptions.element.style.visibility = 'hidden';
        this.svgWrapper = this._document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
        this.svgWrapper.id = SVG_CLONED_ELEMENT_ID;
        this.svgWrapper.style.position = 'fixed';
        this.svgWrapper.style.transformOrigin = `0 0`;
        this.svgWrapper.style.fill = 'rgb(51, 51, 51)';
        this.svgWrapper.style.opacity = '0.65';
        this.svgWrapper.style.cursor = 'grabbing';
        this.svgWrapper.style.left = '0';
        this.svgWrapper.style.top = '0';
        this.svgWrapper.style.width = '200px';
        this.svgWrapper.style.height = '200px';
        this.svgWrapper.setAttribute('viewBox', '0 0 200 200');

        this.svgWrapper.appendChild(clonedElement);

        const svgRectWhite = this._document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGRectElement;
        svgRectWhite.setAttribute('width', (width + translateKey * 2).toString());
        svgRectWhite.setAttribute('height', (height + 20).toString());
        svgRectWhite.setAttribute('fill', 'white');
        svgRectWhite.setAttribute('rx', '4');
        svgRectWhite.setAttribute('ry', '4');
        svgRectWhite.id = 'tmp-white-rectangle';
        this.svgWrapper.insertBefore(svgRectWhite, clonedElement);

        const svgTextExchange = this._document.createElementNS('http://www.w3.org/2000/svg', 'text') as SVGTextElement;
        svgTextExchange.setAttribute('x', ((width + translateKey * 2) / 2).toString());
        svgTextExchange.setAttribute('y', (height + 12).toString());
        svgTextExchange.setAttribute('fill', 'black');
        svgTextExchange.setAttribute('font-size', '14');
        svgTextExchange.innerHTML = 'Exchange';
        svgTextExchange.setAttribute('text-anchor', 'middle');
        svgTextExchange.setAttribute('alignment-baseline', 'middle');
        this.svgWrapper.appendChild(svgTextExchange);

        this.setSvgWrapperTransformation(this.lefButtonDownOptions.element);
        this._document.body.appendChild(this.svgWrapper);
        this.offset = {
            x: this.rect.x - this.lefButtonDownOptions.event.clientX - translateKey,
            y: this.rect.y - this.lefButtonDownOptions.event.clientY - translateKey
        };
        this.dragging = true;
    }

    private drop(): void {
        if (!this.dragging) {
            return;
        }

        this.removeActiveCssFromDropElement();
        this._document.body.removeChild(this.svgWrapper);
        this.lefButtonDownOptions.element.style.visibility = 'visible';

        if (this.dropElement) {
            const payload: ExchangeKeysActionModel = {
                remapInfo: {
                    remapOnAllKeymap: this.leftButtonUpEvent.ctrlKey,
                    remapOnAllLayer: this.leftButtonUpEvent.altKey
                },
                aKey: {
                    keyId: convertKeyIdToNumber(this.lefButtonDownOptions.keyId),
                    layerId: getLayerId(this.lefButtonDownOptions.element),
                    keymapAbbr: this.keymap.abbreviation,
                    moduleId: getModuleId(this.lefButtonDownOptions.element)
                },
                bKey: {
                    keyId: convertKeyIdToNumber(this.dropElement.id),
                    layerId: getLayerId(this.dropElement),
                    keymapAbbr: this.keymap.abbreviation,
                    moduleId: getModuleId(this.dropElement)
                }
            };

            this._store.dispatch(new ExchangeKeysAction(payload));
        }
    }

    private setSvgWrapperTransformation(element: Element): void {
        if (!element) {
            return;
        }

        const moduleId = getModuleId(element);

        if (moduleId && moduleId === this.moduleId) {
            return;
        }

        this.moduleId = moduleId;
        if (this.halvesInfo.areHalvesMerged) {
            this.svgWrapper.style.transform = `scale(${this.scale}, ${this.scale})`;
        } else if (moduleId === 0 || moduleId === 3 || moduleId === 4 || moduleId === 5) {
            const size = 0.80 * this.scale;
            this.svgWrapper.style.transform = `translate(0,5%) rotate(-10deg) scale(${size}, ${size})`;
        } else if (moduleId === 1 || moduleId === 2) {
            const size = 0.80 * this.scale;
            this.svgWrapper.style.transform = `translate(5%,0) rotate(10.8deg) scale(${size}, ${size})`;
        }
    }

    private isMovedMinimum(event: MouseEvent): boolean {
        return Math.abs(this.lefButtonDownOptions.event.clientX - event.clientX) > MIN_MOVE_TO_START_DRAG
        || Math.abs(this.lefButtonDownOptions.event.clientY - event.clientY) > MIN_MOVE_TO_START_DRAG;
    }
}

function getModuleId(element: Element): number | undefined {
    let parent = element.parentElement;

    while (parent) {
        if (parent.hasAttribute('svg-module')) {
            break;
        }

        parent = parent.parentElement;
    }

    if (parent) {
        return parseInt(parent.getAttribute('moduleId'));
    }
}

function getLayerId(element: Element): number | undefined {
    let parent = element.parentElement;

    while (parent) {
        if (parent.tagName === 'SVG-KEYBOARD') {
            break;
        }

        parent = parent.parentElement;
    }

    if (parent) {
        return parseInt(parent.getAttribute('layerId'));
    }
}

function convertKeyIdToNumber(keyId: string): number {
    return parseInt(keyId.split('-').pop()) - 1;
}

function isDropElement(element: Element): boolean {
    if (!element.classList) {
        return false;
    }

    return SVG_DISPLAY_ELEMENT_CLASSES.some(elClass => element.classList.contains(elClass));
}
