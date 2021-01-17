import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { KeyAction, Macro } from 'uhk-common';
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
    @Input() coverages: any[];
    @Input() keyboardKeys: SvgKeyboardKey[];
    @Input() keyActions: KeyAction[];
    @Input() selectedKey: { layerId: number, moduleId: number, keyId: number };
    @Input() selected: boolean;
    @Input() capturingEnabled: boolean;
    @Input() lastEdited: boolean;
    @Input() lastEditedKeyId: string;
    @Output() keyClick = new EventEmitter<SvgModuleKeyClickEvent>();
    @Output() keyHover = new EventEmitter();
    @Output() capture = new EventEmitter<SvgModuleCaptureEvent>();

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
        let transform = `translate(${key.x} ${key.y})`;

        if (key.transform) {
            transform += ` ${key.transform}`;
        }

        return transform;
    }
}
