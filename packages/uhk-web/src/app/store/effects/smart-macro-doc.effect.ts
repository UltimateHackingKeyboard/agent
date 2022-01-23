import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SmartMacroDocRendererService } from '../../services/smart-macro-doc-renderer.service';
import { ActionTypes } from '../actions/smart-macro-doc.action';

@Injectable()
export class SmartMacroDocEffect {

    @Effect({dispatch: false}) appStart$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.TogglePanelVisibility),
            tap(() => this.smartMacroDocRendererService.downloadDocumentation())
        );

    constructor(private actions$: Actions,
                private smartMacroDocRendererService: SmartMacroDocRendererService) {
    }
}
