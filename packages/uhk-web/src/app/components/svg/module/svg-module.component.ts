import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BacklightingMode, HostConnection, KeyAction, Macro, UhkThemeColors } from 'uhk-common';
import { Subscription } from 'rxjs';

import { LastEditedKey } from '../../../models/last-edited-key';
import { SvgKeyboardKey } from '../keys';
import {
    SvgKeyCaptureEvent,
    SvgKeyClickEvent,
    SvgModuleCaptureEvent,
    SvgModuleKeyClickEvent
} from '../../../models/svg-key-events';
import { AppState, getHostConnections, getMacroMap } from '../../../store';

@Component({
    selector: 'g[svg-module]',
    standalone: false,
    templateUrl: './svg-module.component.html',
    styleUrls: ['./svg-module.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgModuleComponent implements OnDestroy {
    @Input() backlightingMode: BacklightingMode;
    @Input() coverages: any[];
    @Input() circles: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() uhkThemeColors: UhkThemeColors;
    @Input() capturingEnabled: boolean;
    @Input() lastEdited: boolean;
    @Input() lastEditedKey: LastEditedKey;
    @Input() moduleNavCircle: any;
    @Input() moduleNavPath: any;
    @Output() keyClick = new EventEmitter<SvgModuleKeyClickEvent>();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter<SvgModuleCaptureEvent>();
    @Output() navigateToModuleSettings = new EventEmitter<void>();

    hostConnections: HostConnection[] = []
    macroMap: Map<number, Macro>;
    private macroMapSubscription: Subscription;
    private hostConnectionsSubscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.keyboardKeys = [];
        this.macroMapSubscription = store.select(getMacroMap)
            .subscribe(map => this.macroMap = map);
        this.hostConnectionsSubscription = this.store.select(getHostConnections)
            .subscribe((connections: HostConnection[]) => {
                this.hostConnections = connections;
            });
    }

    ngOnDestroy(): void {
        this.macroMapSubscription.unsubscribe();
        this.hostConnectionsSubscription?.unsubscribe();
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
