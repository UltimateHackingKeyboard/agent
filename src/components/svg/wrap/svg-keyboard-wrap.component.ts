import {
    Component, Input, OnInit, style,
    state, animate, transition, trigger, OnChanges
} from '@angular/core';

import { KeyAction } from '../../../config-serializer/config-items/KeyAction';
import { Layer } from '../../../config-serializer/config-items/Layer';
import {NoneAction} from '../../../config-serializer/config-items/NoneAction';

@Component({
    selector: 'svg-keyboard-wrap',
    template: require('./svg-keyboard-wrap.component.html'),
    styles: [require('./svg-keyboard-wrap.component.scss')],
    animations: [
        trigger('layerState', [
            /* Right -> Left animation*/
            state('leftIn', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('leftOut', style({
                transform: 'translateX(-101%)',
                left: '0'
            })),
            /* Right -> Left animation */
            state('rightIn', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('rightOut', style({
                transform: 'translateX(0%)',
                left: '101%'
            })),
            /* Transitions */
            transition('none => leftIn, leftOut => leftIn', [
                style({
                    opacity: 0,
                    transform: 'translateX(0%)',
                    left: '101%'
                }),
                style({
                    opacity: 1
                }),
                animate('400ms ease-out')
            ]),
            transition('* => none', [
                style({
                    opacity: 0,
                    transform: 'translateX(-101%)',
                    left: '0'
                }),
                style({
                    opacity: 1
                })
            ]),
            transition('none => rightIn, rightOut => rightIn', [
                style({
                    opacity: 0,
                    transform: 'translateX(-101%)',
                    left: '0'
                }),
                style({
                    opacity: 1
                }),
                animate('400ms ease-out')
            ]),
            transition(
                'leftIn => leftOut,' +
                'rightIn => rightOut,' +
                'leftIn <=> rightOut,' +
                'rightIn <=> leftOut',
                animate('400ms ease-out')
            )
        ])
    ]
})
export class SvgKeyboardWrapComponent implements OnInit, OnChanges {
    @Input() layers: Layer[];
    @Input() popoverEnabled: boolean = true;
    @Input() tooltipEnabled: boolean = false;

    private popoverShown: boolean;
    private keyEditConfig: { moduleId: number, keyId: number };
    private popoverInitKeyAction: KeyAction;
    private currentLayer: number = 0;
    private tooltipData: { posTop: number, posLeft: number, content: string, shown: boolean };

    constructor() {
        this.keyEditConfig = {
            moduleId: undefined,
            keyId: undefined
        };

        this.tooltipData = {
            posTop: 0,
            posLeft: 0,
            content: '',
            shown: false
        };
    }

    ngOnInit() {
        this.layers[0].animation = 'leftIn';
    }

    ngOnChanges() {
        this.currentLayer = 0;
        if (this.layers.length > 0) {
            this.layers.forEach((element) => {
                element.animation = 'none';

                return element;
            });
            this.layers[0].animation = 'leftIn';
        }
    }

    onKeyClick(moduleId: number, keyId: number): void {
        if (!this.popoverShown && this.popoverEnabled) {
            this.keyEditConfig = {
                moduleId,
                keyId
            };

            let keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules.elements[moduleId].keyActions.elements[keyId];
            this.showPopover(keyActionToEdit);
        }
    }

    onKeyHover(moduleId: number, event: MouseEvent, over: boolean, keyId: number): void {
        let keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules.elements[moduleId].keyActions.elements[keyId];

        if (this.tooltipEnabled) {
            if (over) {
                this.showTooltip(keyActionToEdit, event);
            } else {
                this.hideTooltip(event);
            }
        }
    }

    onRemap(keyAction: KeyAction): void {
        this.changeKeyAction(keyAction);
        this.hidePopover();
    }

    showPopover(keyAction?: KeyAction): void {
        this.popoverInitKeyAction = keyAction;
        this.popoverShown = true;
    }

    showTooltip(keyAction: KeyAction, event: MouseEvent): void {

        if (keyAction instanceof NoneAction || keyAction === undefined) {
            return;
        }

        let el: Element = event.target as Element || event.srcElement;
        let position: ClientRect = el.getBoundingClientRect();
        let posLeft: number = this.tooltipData.posLeft;
        let posTop: number = this.tooltipData.posTop;

        if (el.tagName === 'rect') {
            posLeft = position.left + (position.width / 2);
            posTop = position.top;
        }

        this.tooltipData = {
            posLeft: posLeft,
            posTop:  posTop,
            content: 'Key action: <br>Scancode: <br>Modifiers: <br>Long press action:',
            shown: true
        };
    }

    hideTooltip(event: MouseEvent) {
        let target: HTMLElement = event.relatedTarget as HTMLElement;
        if (!target) {
            this.tooltipData.shown = false;
            return;
        }

        // Check if we are hovering tooltip
        let list: DOMTokenList = target.classList;
        if (!list.contains('tooltip') && !list.contains('tooltip-inner')) {
            this.tooltipData.shown = false;
        }
    }

    hidePopover(): void {
        this.popoverShown = false;
        this.popoverInitKeyAction = undefined;
    }

    changeKeyAction(keyAction: KeyAction): void {
        let moduleId = this.keyEditConfig.moduleId;
        let keyId = this.keyEditConfig.keyId;
        this.layers[this.currentLayer].modules.elements[moduleId].keyActions.elements[keyId] = keyAction;
    }

    selectLayer(oldIndex: number, index: number): void {
        if (index > oldIndex) {
            this.layers[oldIndex].animation = 'leftOut';
            this.layers[index].animation = 'leftIn';
        } else {
            this.layers[oldIndex].animation = 'rightOut';
            this.layers[index].animation = 'rightIn';
        }

        this.currentLayer = index;
    }
}
