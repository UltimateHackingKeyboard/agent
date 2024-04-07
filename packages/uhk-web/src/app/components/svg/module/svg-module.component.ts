import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    ChangeDetectionStrategy,
    SimpleChanges
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
export class SvgModuleComponent implements OnChanges, OnDestroy {
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

    puzzleFillColor = 'var(--color-module-puzzle-path-fill)';

    constructor(private store: Store<AppState>) {
        this.keyboardKeys = [];
        this.macroMapSubscription = store.select(getMacroMap)
            .subscribe(map => this.macroMap = map);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.backlightingMode) {
            this.puzzleFillColor = this.backlightingMode === BacklightingMode.FunctionalBacklighting
                ? 'var(--color-module-puzzle-path-fill)'
                : 'var(--color-module-puzzle-perkey-path-fill)';
        }
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
