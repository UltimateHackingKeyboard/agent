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

    private activeTabIndex: number;

    constructor() {
        this.activeTabIndex = -1;
    }

    ngOnInit() {
        let tabIndex: number;
        if (this.defaultKeyAction instanceof KeystrokeAction) {
            tabIndex = 0;
        } else if (this.defaultKeyAction instanceof SwitchLayerAction) {
            tabIndex = 1;
        } else if (this.defaultKeyAction instanceof MouseAction) {
            tabIndex = 2;
        } else if (this.defaultKeyAction instanceof PlayMacroAction) {
            tabIndex = 3;
        } else if (this.defaultKeyAction instanceof SwitchKeymapAction) {
            tabIndex = 4;
        } else {
            tabIndex = 5;
        }
        this.selectTab(tabIndex);
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

    selectTab(index: number): void {
        this.activeTabIndex = index;
    }

}
