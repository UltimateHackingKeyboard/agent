import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBan, faClone, faKeyboard, faMousePointer, faPlay } from '@fortawesome/free-solid-svg-icons';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
    KeyAction,
    Keymap,
    KeystrokeAction,
    LayerName,
    MouseAction,
    PlayMacroAction,
    SecondaryRoleAction,
    SwitchKeymapAction,
    SwitchLayerAction
} from 'uhk-common';

import { Tab } from './tab';

import {
    AppState,
    extraMouseButtonsSupported,
    getKeymapOptions,
    getKeymaps,
    getLayerOptions,
    macroPlaybackSupported
} from '../../store';
import { KeyActionRemap } from '../../models/key-action-remap';
import { RemapInfo } from '../../models/remap-info';
import { SelectOptionData } from '../../models/select-option-data';
import { faSquareA } from '../../custom-fa-icons';
import { LayerOption } from '../../models';

enum TabName {
    Keypress,
    Layer,
    Mouse,
    Macro,
    Keymap,
    None
}

export interface TabHeader {
    text: string;
    icon: IconDefinition;
    tabName: TabName;
    disabled?: boolean;
}

@Component({
    selector: 'popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverComponent implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() currentKeymap: Keymap;
    @Input() currentLayer: LayerOption;
    @Input() visible: boolean;
    @Input() allowLayerDoubleTap: boolean;
    @Input() remapInfo: RemapInfo;
    @Input() leftArrow: boolean = false;
    @Input() rightArrow: boolean = false;

    @Output() cancel = new EventEmitter<any>();
    @Output() remap = new EventEmitter<KeyActionRemap>();

    @ViewChild('tab', { static: false }) selectedTab: Tab;

    tabName = TabName;
    keyActionValid: boolean;
    activeTab: TabName;
    keymaps$: Observable<Keymap[]>;
    keymapOptions$: Observable<SelectOptionData[]>;
    shadowKeyAction: KeyAction;
    disableRemapOnAllLayer = false;
    tabHeaders: TabHeader[] = [
        {
            tabName: TabName.Keypress,
            icon: faSquareA,
            text: 'Keypress'
        },
        {
            tabName: TabName.Layer,
            icon: faClone,
            text: 'Layer'
        },
        {
            tabName: TabName.Mouse,
            icon: faMousePointer,
            text: 'Mouse'
        },
        {
            tabName: TabName.Macro,
            icon: faPlay,
            text: 'Macro'
        },
        {
            tabName: TabName.Keymap,
            icon: faKeyboard,
            text: 'Keymap'
        },
        {
            tabName: TabName.None,
            icon: faBan,
            text: 'None'
        }
    ];
    macroPlaybackSupported$: Observable<boolean>;
    extraMouseButtonsSupported$: Observable<boolean>;
    layerOptions$: Observable<LayerOption[]>;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.keymaps$ = store.select(getKeymaps);
        this.keymapOptions$ = store.select(getKeymapOptions);
        this.macroPlaybackSupported$ = store.select(macroPlaybackSupported);
        this.extraMouseButtonsSupported$ = store.select(extraMouseButtonsSupported);
        this.layerOptions$ = store.select(getLayerOptions);
    }

    ngOnChanges(change: SimpleChanges) {
        let tab: TabHeader = this.tabHeaders[5];

        if (change['defaultKeyAction']) {
            this.disableRemapOnAllLayer = false;

            if (this.defaultKeyAction instanceof KeystrokeAction) {
                this.keystrokeActionChange(this.defaultKeyAction);
                tab = this.tabHeaders[0];
            } else if (this.defaultKeyAction instanceof SwitchLayerAction) {
                tab = this.tabHeaders[1];
            } else if (this.defaultKeyAction instanceof MouseAction) {
                tab = this.tabHeaders[2];
            } else if (this.defaultKeyAction instanceof PlayMacroAction) {
                tab = this.tabHeaders[3];
            } else if (this.defaultKeyAction instanceof SwitchKeymapAction) {
                tab = this.tabHeaders[4];
            } else {
                tab = this.tabHeaders[5];
            }

            for (const tabHeader of this.tabHeaders) {
                const allowOnlyLayerTab = tab.tabName === TabName.Layer && this.currentLayer?.id !== LayerName.base;

                tabHeader.disabled = allowOnlyLayerTab && tabHeader.tabName !== TabName.Layer;
            }
        }

        if (change['visible']) {
            if (change['visible'].currentValue) {
                this.selectTab(tab);
            }
        }
    }

    onCancelClick(): void {
        this.cancel.emit(undefined);
    }

    onRemapKey(): void {
        if (this.keyActionValid) {
            try {
                this.remap.emit({
                    remapOnAllKeymap: this.remapInfo.remapOnAllKeymap,
                    remapOnAllLayer: this.remapInfo.remapOnAllLayer,
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

    @HostListener('document:keydown.control.enter', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.visible) {
            this.onRemapKey();
            event.preventDefault();
        }
    }

    selectTab(tab: TabHeader): void {
        if (tab.disabled) {
            return;
        }

        this.activeTab = tab.tabName;
        if (tab.tabName === TabName.Keypress) {
            this.keystrokeActionChange(this.defaultKeyAction as KeystrokeAction);
        }
    }

    remapInfoChange(): void {
        this.selectedTab.remapInfoChanged(this.remapInfo);
    }

    keystrokeActionChange(keystrokeAction: KeystrokeAction): void {
        this.shadowKeyAction = keystrokeAction;
        const disableRemapOnAllLayer =
            keystrokeAction &&
            this.currentLayer?.id === LayerName.base &&
            (keystrokeAction.secondaryRoleAction === SecondaryRoleAction.fn ||
                keystrokeAction.secondaryRoleAction === SecondaryRoleAction.mod ||
                keystrokeAction.secondaryRoleAction === SecondaryRoleAction.mouse);

        if (this.disableRemapOnAllLayer !== disableRemapOnAllLayer) {
            this.disableRemapOnAllLayer = disableRemapOnAllLayer;

            if (disableRemapOnAllLayer) {
                this.remapInfo.remapOnAllLayer = false;
            }

            this.cdRef.markForCheck();
        }
    }

    setKeyActionValidState($event: boolean): void {
        this.keyActionValid = $event;
        this.cdRef.detectChanges();
    }

    trackTabHeader(index: number, tabItem: TabHeader): string {
        return tabItem.tabName.toString();
    }
}
