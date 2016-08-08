import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {NgSwitch, NgSwitchCase} from '@angular/common';

import {KeyAction} from '../../../config-serializer/config-items/KeyAction';

import {KeypressTabComponent} from './tab/keypress/keypress-tab.component';
import {LayerTabComponent} from './tab/layer/layer-tab.component';
import {MouseTabComponent} from './tab/mouse/mouse-tab.component';
import {MacroTabComponent} from './tab/macro/macro-tab.component';
import {KeymapTabComponent} from './tab/keymap/keymap-tab.component';
import {NoneTabComponent} from './tab/none/none-tab.component';

import {Tab} from './tab/tab';
import {KeystrokeAction} from '../../../config-serializer/config-items/KeystrokeAction';
import {SwitchLayerAction} from '../../../config-serializer/config-items/SwitchLayerAction';
import {MouseAction} from '../../../config-serializer/config-items/MouseAction';
import {PlayMacroAction} from '../../../config-serializer/config-items/PlayMacroAction';
import {SwitchKeymapAction} from '../../../config-serializer/config-items/SwitchKeymapAction';

enum TabName {
    Keypress,
    Layer,
    Mouse,
    Macro,
    Keymap,
    None
}

@Component({
    moduleId: module.id,
    selector: 'popover',
    template: require('./popover.component.html'),
    styles: [require('./popover.component.scss')],
    host: { 'class': 'popover' },
    directives:
    [
        NgSwitch,
        NgSwitchCase,
        KeypressTabComponent,
        LayerTabComponent,
        MouseTabComponent,
        MacroTabComponent,
        KeymapTabComponent,
        NoneTabComponent
    ]
})
export class PopoverComponent implements OnInit {
    @Input() defaultKeyAction: KeyAction;

    @Output() cancel = new EventEmitter<any>();
    @Output() remap = new EventEmitter<KeyAction>();

    @ViewChild('tab') selectedTab: Tab;

    private TabName = TabName;
    private activeTab: TabName;

    constructor() { }

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
