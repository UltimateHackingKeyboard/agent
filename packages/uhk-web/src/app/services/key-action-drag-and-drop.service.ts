import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HalvesInfo, Keymap } from 'uhk-common';

import { AppState, getHalvesInfo, getSelectedKeymap } from '../store';
import { ExchangeKeysActionModel } from '../models';
import { ExchangeKeysAction } from '../store/actions/keymap';

export interface LeftButtonDownOptions {
    keyId: string;
    event: MouseEvent;
    element: SVGGElement;
}

enum DragRotation {
    None,
    Left,
    Right
}

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
    private dragRotation = DragRotation.None;
    private offset = {
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
        const rec = this.lefButtonDownOptions.element.getBoundingClientRect();
        this.offset = {
            x: rec.x - this.lefButtonDownOptions.event.clientX,
            y: rec.y - this.lefButtonDownOptions.event.clientY
        };
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
        this.dragRotation = DragRotation.None;
    }

    mouseMove(event: MouseEvent): void {
        if (!this.isLeftButtonDown) {
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
        for (const element of elements) {
            if (element.tagName === 'rect' &&
                !element.hasAttribute('data-cloned-rect') &&
                element.id !== 'tmp-white-rectangle'
            ) {
                foundElement = element;
                break;
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

        this.lefButtonDownOptions.element.style.visibility = 'hidden';
        this.svgWrapper = this._document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
        this.svgWrapper.style.position = 'fixed';
        this.svgWrapper.style.transformOrigin = `0 0`;
        this.svgWrapper.style.fill = 'rgb(51, 51, 51)';
        this.svgWrapper.style.cursor = 'grabbing';
        this.svgWrapper.style.left = '0';
        this.svgWrapper.style.top = '0';
        this.svgWrapper.style.width = '150px';
        this.svgWrapper.style.height = '150px';
        this.svgWrapper.setAttribute('viewBox', '0 0 150 150');
        let svgRect: SVGElement = null;
        this.lefButtonDownOptions.element.childNodes.forEach((e: SVGElement): void => {
            const clonedElement = e.cloneNode(true) as SVGElement;
            if (clonedElement.tagName === 'rect') {
                clonedElement.setAttribute('data-cloned-rect', 'true');
                clonedElement.classList.remove('active');
                svgRect = clonedElement;
            }

            if (clonedElement.getAttribute) {
                clonedElement.setAttribute('x', (+clonedElement.getAttribute('x') + 2).toString());
                clonedElement.setAttribute('y', (+clonedElement.getAttribute('y') + 2).toString());
            }

            this.svgWrapper.appendChild(clonedElement);
        });

        const svgRectWhite = this._document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGRectElement;
        const width = +svgRect.getAttribute('width');
        const height = +svgRect.getAttribute('height');
        svgRectWhite.setAttribute('width', (width + 4).toString());
        svgRectWhite.setAttribute('height', (height + 20).toString());
        svgRectWhite.setAttribute('fill', 'white');
        svgRectWhite.setAttribute('rx', '4');
        svgRectWhite.setAttribute('ry', '4');
        svgRectWhite.id = 'tmp-white-rectangle';
        this.svgWrapper.insertBefore(svgRectWhite, svgRect);

        const svgTextExchange = this._document.createElementNS('http://www.w3.org/2000/svg', 'text') as SVGTextElement;
        svgTextExchange.setAttribute('x', ((width + 4) / 2).toString());
        svgTextExchange.setAttribute('y', (height + 12).toString());
        svgTextExchange.setAttribute('fill', 'black');
        svgTextExchange.setAttribute('font-size', '14');
        svgTextExchange.innerHTML = 'Exchange';
        svgTextExchange.setAttribute('text-anchor', 'middle');
        svgTextExchange.setAttribute('alignment-baseline', 'middle');
        this.svgWrapper.appendChild(svgTextExchange);

        this.setSvgWrapperTransformation(this.lefButtonDownOptions.element);
        this._document.body.appendChild(this.svgWrapper);

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

        const scale = this._document.getElementById('keyboard-slider').offsetWidth / 1100;

        this.moduleId = moduleId;
        if (this.halvesInfo.areHalvesMerged) {
            this.svgWrapper.style.transform = `scale(${scale}, ${scale})`;
            this.dragRotation = DragRotation.None;
        } else if (moduleId === 0) {
            const size = 0.80 * scale;
            this.svgWrapper.style.transform = `rotate(-10deg) scale(${size}, ${size})`;
            this.dragRotation = DragRotation.Right;
        } else if (moduleId === 1) {
            const size = 0.80 * scale;
            this.svgWrapper.style.transform = `rotate(10.8deg) scale(${size}, ${size})`;
            this.dragRotation = DragRotation.Left;
        }
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
