import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/map';

import {
    KeyAction,
    Keymap,
    KeystrokeAction,
    MouseAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction
} from 'uhk-common';

import { Tab } from './tab';

import { AppState } from '../../store';
import { getKeymaps } from '../../store/reducers/user-configuration';
import { KeyActionRemap } from '../../models/key-action-remap';

enum TabName {
    Keypress,
    Layer,
    Mouse,
    Macro,
    Keymap,
    None
}

@Component({
    selector: 'popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
    animations: [
        trigger('popover', [
            state('closed', style({
                transform: 'translateY(30px)',
                visibility: 'hidden',
                opacity: 0
            })),
            state('opened', style({
                transform: 'translateY(0)',
                visibility: 'visible',
                opacity: 1
            })),
            transition('opened => closed', [
                animate('200ms ease-out', keyframes([
                    style({transform: 'translateY(0)', visibility: 'visible', opacity: 1, offset: 0}),
                    style({transform: 'translateY(30px)', visibility: 'hidden', opacity: 0, offset: 1})
                ]))
            ]),
            transition('closed => opened', [
                style({
                    visibility: 'visible'
                }),
                animate('200ms ease-out', keyframes([
                    style({transform: 'translateY(30px)', opacity: 0, offset: 0}),
                    style({transform: 'translateY(0)', opacity: 1, offset: 1})
                ]))
            ])
        ])
    ]
})
export class PopoverComponent implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() currentKeymap: Keymap;
    @Input() currentLayer: number;
    @Input() keyPosition: any;
    @Input() wrapPosition: any;
    @Input() visible: boolean;
    @Input() allowLayerDoubleTap: boolean;

    @Output() cancel = new EventEmitter<any>();
    @Output() remap = new EventEmitter<KeyActionRemap>();

    @ViewChild('tab') selectedTab: Tab;
    @ViewChild('popover') popoverHost: ElementRef;

    tabName = TabName;
    keyActionValid: boolean;
    activeTab: TabName;
    keymaps$: Observable<Keymap[]>;
    leftArrow: boolean = false;
    rightArrow: boolean = false;
    topPosition: number = 0;
    leftPosition: number = 0;
    animationState: string;

    remapOnAllKeymap: boolean;
    remapOnAllLayer: boolean;

    private readonly currentKeymap$ = new BehaviorSubject<Keymap>(undefined);

    constructor(store: Store<AppState>) {
        this.animationState = 'closed';
        this.keymaps$ = store.let(getKeymaps())
            .combineLatest(this.currentKeymap$)
            .map(([keymaps, currentKeymap]: [Keymap[], Keymap]) =>
                keymaps.filter((keymap: Keymap) => currentKeymap.abbreviation !== keymap.abbreviation)
            );
    }

    ngOnChanges(change: SimpleChanges) {
        if (this.keyPosition && this.wrapPosition && (change['keyPosition'] || change['wrapPosition'])) {
            this.calculatePosition();
        }

        if (change['defaultKeyAction']) {
            let tab: TabName;

            if (this.defaultKeyAction instanceof KeystrokeAction) {
                tab = TabName.Keypress;
            } else if (this.defaultKeyAction instanceof SwitchLayerAction) {
                tab = TabName.Layer;
            } else if (this.defaultKeyAction instanceof MouseAction) {
                tab = TabName.Mouse;
            } else if (this.defaultKeyAction instanceof PlayMacroAction) {
                tab = TabName.Macro;
            } else if (this.defaultKeyAction instanceof SwitchKeymapAction) {
                tab = TabName.Keymap;
            } else {
                tab = TabName.None;
            }

            this.selectTab(tab);
        }

        if (change['visible']) {
            if (change['visible'].currentValue) {
                this.animationState = 'opened';
                this.remapOnAllKeymap = false;
                this.remapOnAllLayer = false;
            } else {
                this.animationState = 'closed';
            }
        }

        if (change.currentKeymap) {
            this.currentKeymap$.next(this.currentKeymap);
        }
    }

    onCancelClick(): void {
        this.cancel.emit(undefined);
    }

    onRemapKey(): void {
        if (this.keyActionValid) {
            try {
                this.remap.emit({
                    remapOnAllKeymap: this.remapOnAllKeymap,
                    remapOnAllLayer: this.remapOnAllLayer,
                    action: this.selectedTab.toKeyAction()
                });
            } catch (e) {
                // TODO: show error dialog
                console.error(e);
            }
        }
    }

    @HostListener('keydown.escape')
    onEscape(): void {
        this.cancel.emit();
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    onOverlay() {
        this.cancel.emit(undefined);
    }

    private calculatePosition() {
        const offsetLeft: number = this.wrapPosition.left + 265; // 265 is a width of the side menu with a margin
        const popover: HTMLElement = this.popoverHost.nativeElement;
        let newLeft: number = this.keyPosition.left + (this.keyPosition.width / 2);

        this.leftArrow = newLeft < offsetLeft;
        this.rightArrow = (newLeft + popover.offsetWidth) > offsetLeft + this.wrapPosition.width;

        if (this.leftArrow) {
            newLeft = this.keyPosition.left;
        } else if (this.rightArrow) {
            newLeft = this.keyPosition.left - popover.offsetWidth + this.keyPosition.width;
        } else {
            newLeft -= popover.offsetWidth / 2;
        }

        // 7 is a space between a bottom key position and a popover
        this.topPosition = this.keyPosition.top + this.keyPosition.height + 7 + window.scrollY;
        this.leftPosition = newLeft;
    }
}
