import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { distinctUntilChanged, map, tap, withLatestFrom } from 'rxjs/operators';

import { Macro } from 'uhk-common';
import { MapperService } from '../../services/mapper.service';
import { formatMacroKeyAssignmentLabel } from '../../util/format-macro-key-assignment-label';
import * as Keymaps from '../actions/keymap';
import * as Macros from '../actions/macro';
import { AppState, getDefaultUserConfiguration, getSelectedMacro } from '..';
import { SelectMacroAction } from '../actions/macro';

@Injectable()
export class MacroEffects {
    private readonly actions$ = inject(Actions);
    private readonly mapper = inject(MapperService);
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

    macroNavigated$ = createEffect(() => this.actions$
        .pipe(
            ofType(routerNavigatedAction),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map(action => (action.payload.routerState as any).params.macroId),
            distinctUntilChanged(),
            map(macroId => new SelectMacroAction(+macroId))
        ));

    remove$ = createEffect(() => this.actions$
        .pipe(
            ofType<Macros.RemoveMacroAction>(Macros.ActionTypes.Remove),
            tap(action => this.store.dispatch(new Keymaps.CheckMacroAction(action.payload))),
            withLatestFrom(this.store.select(getSelectedMacro)),
            map(([, newMacro]) => newMacro),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            tap(this.navigateToNewMacro.bind(this))

        ),
    { dispatch: false }
    );

    addOrDuplicate$ = createEffect(() => this.actions$
        .pipe(
            ofType<Macros.AddMacroAction | Macros.DuplicateMacroAction>(
                Macros.ActionTypes.Add, Macros.ActionTypes.Duplicate),
            withLatestFrom(this.store.select(getSelectedMacro)),
            map(([, newMacro]) => newMacro),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            tap(this.navigateToNewMacro.bind(this))
        ),
    { dispatch: false }
    );

    assignNewMacro$ = createEffect(() => this.actions$
        .pipe(
            ofType<Keymaps.SaveKeyAction>(Keymaps.ActionTypes.SaveKey),
            withLatestFrom(
                this.store.select(getSelectedMacro),
                this.store.select(getDefaultUserConfiguration),
            ),
            tap(([action, newMacro, defaultUserConfiguration]) => {
                if (action.payload.keyAction.assignNewMacro || action.payload.keyAction.navigateToMacro) {
                    const { keymap, layer, module, key } = action.payload;
                    const isAddKeymap = this.router.url.startsWith('/add-keymap');
                    const keymapName = isAddKeymap ? `new ${keymap.name}` : keymap.name;
                    const backUrl = isAddKeymap
                        ? `/add-keymap/${encodeURIComponent(keymap.abbreviation)}`
                        : `/keymap/${encodeURIComponent(keymap.abbreviation)}?layer=${layer}&module=${module}&key=${key}`;

                    this.navigateToNewMacro(newMacro, {
                        backUrl,
                        backText: formatMacroKeyAssignmentLabel({
                            keymapName,
                            layerId: layer,
                            moduleId: module,
                            keyId: key,
                            defaultUserConfiguration,
                            mapper: this.mapper,
                        }),
                        backSuffix: ' key',
                    });
                }
            }),
        ),
    { dispatch: false }
    );

    private navigateToNewMacro(
        newMacro: Macro,
        back?: { backUrl: string; backText: string; backSuffix?: string },
    ): Promise<boolean> {
        const commands = newMacro ? ['/macro', newMacro.id] : ['/macro'];

        if (back) {
            return this.router.navigate(commands, { queryParams: back });
        }

        return this.router.navigate(commands);
    }
}
