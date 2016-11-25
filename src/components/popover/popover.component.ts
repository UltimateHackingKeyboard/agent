import {
    Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';

import { Store } from '@ngrx/store';

import {
    KeyAction,
    KeystrokeAction,
    MouseAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction
} from '../../config-serializer/config-items/key-action';
import { Keymap } from '../../config-serializer/config-items/Keymap';

import { Tab } from './tab/tab';

import { AppState } from '../../store';
import { getKeymapEntities } from '../../store/reducers';
import { Observable } from 'rxjs/Observable';

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
    template: require('./popover.component.html'),
    styles: [require('./popover.component.scss')],
    host: { 'class': 'popover' }
})
export class PopoverComponent implements OnInit, OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() currentKeymap: Keymap;
    @Input() keyPosition: ClientRect;
    @Input() wrapPosition: ClientRect;

    @Output() cancel = new EventEmitter<any>();
    @Output() remap = new EventEmitter<KeyAction>();

    @ViewChild('tab') selectedTab: Tab;

    @HostBinding('style.top.px') topPosition: number;
    @HostBinding('style.left.px') leftPosition: number;
    @HostBinding('class.leftArrow') leftArrow: boolean = false;
    @HostBinding('class.rightArrow') rightArrow: boolean = false;

    public tabName = TabName;
    private activeTab: TabName;
    private keymaps$: Observable<Keymap[]>;
    private popoverHost: HTMLElement;

    constructor(private store: Store<AppState>, private element: ElementRef) {
        this.popoverHost = element.nativeElement;

        this.keymaps$ = store.let(getKeymapEntities())
            .map((keymaps: Keymap[]) =>
                keymaps.filter((keymap: Keymap) => this.currentKeymap.abbreviation !== keymap.abbreviation)
            );
    }

    ngOnInit() {
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

    ngOnChanges(change: SimpleChanges) {
        if (change['keyPosition'] || change['wrapPosition']) {
            this.calculatePosition();
        }
    }

    onCancelClick(): void {
        this.cancel.emit(undefined);
    }

    onRemapKey(): void {
        try {
            let keyAction = this.selectedTab.toKeyAction();
            this.remap.emit(keyAction);
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
    }

    private calculatePosition() {
        const offsetLeft: number = this.wrapPosition.left + 265;
        let newLeft: number = this.keyPosition.left + (this.keyPosition.width / 2);

        this.leftArrow = newLeft <  offsetLeft;
        this.rightArrow = (newLeft + this.popoverHost.offsetWidth) > offsetLeft + this.wrapPosition.width;

        if (this.leftArrow) {
            newLeft = this.keyPosition.left;
        } else if (this.rightArrow) {
            newLeft = this.keyPosition.left - this.popoverHost.offsetWidth + this.keyPosition.width;
        }

        this.topPosition = this.keyPosition.top + this.keyPosition.height + 7;
        this.leftPosition = newLeft;
    }
}
