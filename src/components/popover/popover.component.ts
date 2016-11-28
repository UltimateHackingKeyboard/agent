import {
    Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild
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
    styles: [require('./popover.component.scss')]
})
export class PopoverComponent implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() currentKeymap: Keymap;
    @Input() keyPosition: ClientRect;
    @Input() wrapPosition: ClientRect;
    @Input() visible: boolean;

    @Output() cancel = new EventEmitter<any>();
    @Output() remap = new EventEmitter<KeyAction>();

    @ViewChild('tab') selectedTab: Tab;
    @ViewChild('popover') popoverHost: ElementRef;

    public tabName = TabName;
    private activeTab: TabName;
    private keymaps$: Observable<Keymap[]>;
    private leftArrow: boolean = false;
    private rightArrow: boolean = false;
    private topPosition: number = 0;
    private leftPosition: number = 0;

    constructor(private store: Store<AppState>) {
        this.keymaps$ = store.let(getKeymapEntities())
            .map((keymaps: Keymap[]) =>
                keymaps.filter((keymap: Keymap) => this.currentKeymap.abbreviation !== keymap.abbreviation)
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

    onOverlay() {
        this.cancel.emit(undefined);
    }

    private calculatePosition() {
        const offsetLeft: number = this.wrapPosition.left + 265;
        let newLeft: number = this.keyPosition.left + (this.keyPosition.width / 2);

        this.leftArrow = newLeft <  offsetLeft;
        this.rightArrow = (newLeft + this.popoverHost.nativeElement.offsetWidth) > offsetLeft + this.wrapPosition.width;

        if (this.leftArrow) {
            newLeft = this.keyPosition.left;
        } else if (this.rightArrow) {
            newLeft = this.keyPosition.left - this.popoverHost.nativeElement.offsetWidth + this.keyPosition.width;
        }

        this.topPosition = this.keyPosition.top + this.keyPosition.height + 7;
        this.leftPosition = newLeft;
    }
}
