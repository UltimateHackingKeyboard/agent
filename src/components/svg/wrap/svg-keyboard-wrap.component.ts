import {
    Component, Input, OnInit, style,
    state, animate, transition, trigger
} from '@angular/core';

import { KeyAction } from '../../../../config-serializer/config-items/KeyAction';
import { SvgKeyboardComponent } from '../keyboard';
import { PopoverComponent } from '../../popover';
import { Module } from '../../../../config-serializer/config-items/Module';
import { Layer } from '../../../../config-serializer/config-items/Layer';

@Component({
    selector: 'svg-keyboard-wrap',
    template: require('./svg-keyboard-wrap.component.html'),
    styles: [require('./svg-keyboard-wrap.component.scss')],
    directives: [SvgKeyboardComponent, PopoverComponent],
    animations: [
        trigger('layerState', [
            /* Right -> Left animation*/
            state('leftIn', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('leftOut', style({
                transform: 'translateX(-100%)',
                left: '0'
            })),
            /* Right -> Left animation */
            state('rightIn', style({
                transform: 'translateX(-50%)',
                left: '50%'
            })),
            state('rightOut', style({
                transform: 'translateX(0%)',
                left: '100%'
            })),
            /* Transitions */
            transition('none => leftIn, leftOut => leftIn', [
                style({
                    opacity: 0,
                    transform: 'translateX(0%)',
                    left: '100%'
                }),
                style({
                    opacity: 1
                }),
                animate('500ms ease-in')
            ]),
            transition('* => none', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)',
                    left: '0'
                }),
                style({
                    opacity: 1
                })
            ]),
            transition('none => rightIn, rightOut => rightIn', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)',
                    left: '0'
                }),
                style({
                    opacity: 1
                }),
                animate('500ms ease-in')
            ]),
            transition(
                'leftIn => leftOut,' +
                'rightIn => rightOut,' +
                'leftIn <=> rightOut,' +
                'rightIn <=> leftOut',
                animate('500ms ease-in')
            )
        ])
    ]
})
export class SvgKeyboardWrapComponent implements OnInit {
    @Input() layers: Layer[];
    @Input() popoverEnabled: boolean = true;
    @Input() animationEnabled: boolean = true;

    private popoverShown: boolean;
    private keyEditConfig: { moduleId: number, keyId: number };
    private popoverInitKeyAction: KeyAction;
    private module: Module[];
    private currentLayer: number;

    private layersLength: number;

    constructor() {
        this.keyEditConfig = {
            moduleId: undefined,
            keyId: undefined
        };

        this.currentLayer = 0;
    }

    ngOnInit() {
        this.layers[0].animation = 'leftIn';
        this.layersLength = this.layers.length;
    }

    ngOnChanges() {
        this.currentLayer = 0;
        this.layers.map((layer: Layer) => layer.animation = 'none');
        this.layers[0].animation = 'leftIn';
        this.layersLength = this.layers.length;
    }

    onKeyClick(moduleId: number, keyId: number, module: Module[]): void {
        if (!this.popoverShown) {
            this.keyEditConfig = {
                moduleId,
                keyId
            };

            this.module = module;

            let keyActionToEdit: KeyAction = module[moduleId].keyActions.elements[keyId];
            this.showPopover(keyActionToEdit);
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

    hidePopover(): void {
        this.popoverShown = false;
        this.popoverInitKeyAction = undefined;
    }

    changeKeyAction(keyAction: KeyAction): void {
        let moduleId = this.keyEditConfig.moduleId;
        let keyId = this.keyEditConfig.keyId;
        this.module[moduleId].keyActions.elements[keyId] = keyAction;
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
