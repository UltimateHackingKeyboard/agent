import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BacklightingMode, KeyAction, Macro, UhkThemeColors } from 'uhk-common';
import { Subscription } from 'rxjs';

import { SvgKeyboardKey } from '../keys';
import {
    SvgKeyCaptureEvent,
    SvgKeyClickEvent,
    SvgModuleCaptureEvent,
    SvgModuleKeyClickEvent
} from '../../../models/svg-key-events';
import { AppState, getMacroMap } from '../../../store';

@Component({
    selector: 'g[svg-module]',
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
    @Input() lastEditedKeyId: string;
    @Input() moduleNavCircle: any;
    @Input() moduleNavPath: any;
    @Output() keyClick = new EventEmitter<SvgModuleKeyClickEvent>();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter<SvgModuleCaptureEvent>();
    @Output() navigateToModuleSettings = new EventEmitter<void>();

    private macroMap: Map<number, Macro>;
    private macroMapSubscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.keyboardKeys = [];
        this.macroMapSubscription = store.select(getMacroMap)
            .subscribe(map => this.macroMap = map);
    }

    ngOnDestroy(): void {
        this.macroMapSubscription.unsubscribe();
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

    calcTransform(key: SvgKeyboardKey): string {
        let transform;

        if (key.x && key.y) {
            transform = `translate(${key.x} ${key.y})`;
        }

        if (key.transform) {
            if (transform) {
                transform = `${key.transform} ${transform}`;
            } else {
                transform = `${key.transform}`;
            }
        }

        return transform;
    }
}
