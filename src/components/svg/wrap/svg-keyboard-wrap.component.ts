import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/core';

import { Store } from '@ngrx/store';

import { KeyAction, NoneAction } from '../../../config-serializer/config-items/key-action';
import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { Layer } from '../../../config-serializer/config-items/Layer';

import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'svg-keyboard-wrap',
    template: require('./svg-keyboard-wrap.component.html'),
    styles: [require('./svg-keyboard-wrap.component.scss')],
    // We use 101%, because there was still a trace of the keyboard in the screen when animation was done
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
export class SvgKeyboardWrapComponent implements OnChanges {
    @Input() keymap: Keymap;
    @Input() popoverEnabled: boolean = true;
    @Input() tooltipEnabled: boolean = false;

    private popoverShown: boolean;
    private keyEditConfig: { keyActions: KeyAction[], keyId: number };
    private popoverInitKeyAction: KeyAction;
    private currentLayer: number = 0;
    private tooltipData: { posTop: number, posLeft: number, content: {name: string, value: string}[], shown: boolean };
    private layers: Layer[];

    constructor(
        private store: Store<AppState>
    ) {
        this.keyEditConfig = {
            keyActions: undefined,
            keyId: undefined
        };

        this.tooltipData = {
            posTop: 0,
            posLeft: 0,
            content: [],
            shown: false
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['keymap'].previousValue.abbreviation !== changes['keymap'].currentValue.abbreviation) {
            this.layers = this.keymap.layers;
            this.currentLayer = 0;
            this.popoverShown = false;

            if (this.layers.length > 0) {
                this.layers.forEach(element => element.animation = 'none');
                this.layers[0].animation = 'leftIn';
            }
        } else if (changes['keymap']) {
            this.popoverShown = false;
        }
    }

    onKeyClick(moduleId: number, keyId: number): void {
        if (!this.popoverShown && this.popoverEnabled) {
            this.keyEditConfig = {
                keyActions: this.layers[this.currentLayer].modules[moduleId].keyActions,
                keyId
            };

            let keyActionToEdit: KeyAction = this.keyEditConfig.keyActions[keyId];
            this.showPopover(keyActionToEdit);
        }
    }

    onKeyHover(moduleId: number, event: MouseEvent, over: boolean, keyId: number): void {
        let keyActionToEdit: KeyAction = this.layers[this.currentLayer].modules[moduleId].keyActions[keyId];

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
        this.store.dispatch(KeymapActions.saveKey(this.keymap));
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

        // TODO connect with real data
        let dummyData = [
            {
                name: 'Key action',
                value: 'o'
            },
            {
                name: 'Scancode',
                value: '55'
            }
        ];

        this.tooltipData = {
            posLeft: posLeft,
            posTop:  posTop,
            content: dummyData,
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
        let keyId = this.keyEditConfig.keyId;
        this.keyEditConfig.keyActions[keyId] = keyAction;
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
