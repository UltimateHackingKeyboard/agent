import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

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
export class PopoverComponent implements OnInit {
    @Input() defaultKeyAction: KeyAction;

    @Output() cancel = new EventEmitter<any>();
    @Output() remap = new EventEmitter<KeyAction>();

    @ViewChild('tab') selectedTab: Tab;

    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private TabName = TabName;
    /* tslint:enable:no-unused-variable tslint:enable:variable-name */
    private activeTab: TabName;
    private keymaps$: Observable<Keymap[]>;

    constructor(private store: Store<AppState>) {
        this.keymaps$ = store.let(getKeymapEntities());
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
}
