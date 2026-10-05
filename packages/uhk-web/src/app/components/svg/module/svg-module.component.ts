import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BacklightingMode, HostConnection, KeyAction, Macro, UhkThemeColors, UserConfiguration } from 'uhk-common';
import { Subscription } from 'rxjs';

import { LastEditedKey } from '../../../models/last-edited-key';
import { SvgKeyboardKey } from '../keys';
import {
    SvgKeyCaptureEvent,
    SvgKeyClickEvent,
    SvgModuleCaptureEvent,
    SvgModuleKeyClickEvent
} from '../../../models/svg-key-events';
import { AppState, getDefaultUserConfiguration, getHostConnections, getMacroMap } from '../../../store';

@Component({
    selector: 'g[svg-module]',
    standalone: false,
    templateUrl: './svg-module.component.html',
    styleUrls: ['./svg-module.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgModuleComponent implements OnDestroy {
    @Input() backlightingMode: BacklightingMode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() coverages: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() circles: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() uhkThemeColors: UhkThemeColors;
    @Input() capturingEnabled: boolean;
    @Input() lastEdited: boolean;
    @Input() lastEditedKey: LastEditedKey;
    @Input() moduleId = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() moduleNavCircle: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() moduleNavPath: any;
    @Output() keyClick = new EventEmitter<SvgModuleKeyClickEvent>();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter<SvgModuleCaptureEvent>();
    @Output() navigateToModuleSettings = new EventEmitter<void>();

    defaultUserConfiguration = new UserConfiguration();
    hostConnections: HostConnection[] = [];
    macroMap = new Map<number, Macro>();
    private readonly subscriptions = new Subscription();
    private readonly store = inject<Store<AppState>>(Store);
    private readonly cdRef = inject(ChangeDetectorRef);

    constructor() {
        this.keyboardKeys = [];
        this.subscriptions.add(
            this.store.select(getMacroMap).subscribe(macroMap => {
                this.macroMap = macroMap;
                this.cdRef.markForCheck();
            })
        );
        this.subscriptions.add(
            this.store.select(getHostConnections).subscribe((connections: HostConnection[]) => {
                this.hostConnections = connections;
                this.cdRef.markForCheck();
            })
        );
        this.subscriptions.add(
            this.store.select(getDefaultUserConfiguration).subscribe(defaultUserConfiguration => {
                this.defaultUserConfiguration = defaultUserConfiguration;
                this.cdRef.markForCheck();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onKeyClick(keyId: number, event: SvgKeyClickEvent): void {
        this.keyClick.emit({
            ...event,
            keyId
        });
    }

    onKeyHover(index: number, event: MouseEvent, over: boolean): void {
        this.keyHover.emit({
            index,
            event,
            over
        });
    }

    onCapture(keyId: number, event: SvgKeyCaptureEvent) {
        this.capture.emit({
            ...event,
            keyId
        });
    }

    keyboardKeysTrackBy(index: number, key: SvgKeyboardKey): string {
        return `${index}`;
    }
}
