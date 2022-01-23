import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { Macro, MacroAction } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

import {
    AddMacroActionAction,
    DeleteMacroActionAction,
    ReorderMacroActionAction,
    SaveMacroActionAction,
    SelectMacroAction
} from '../../../store/actions/macro';
import {
    AppState,
    getSelectedMacro,
    getSmartMacroPanelVisibility,
    getSmartMacroPanelWidth,
    macroPlaybackSupported,
    selectSmartMacroDocUrl
} from '../../../store';
import { IOutputData, SplitComponent } from 'angular-split';
import { PanelSizeChangedAction, TogglePanelVisibilityAction } from '../../../store/actions/smart-macro-doc.action';

@Component({
    selector: 'macro-edit',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './macro-edit.component.html',
    styleUrls: ['./macro-edit.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class MacroEditComponent implements OnDestroy {
    faCaretLeft = faCaretLeft;
    macro: Macro;
    isNew: boolean;
    macroId: number;
    macroPlaybackSupported$: Observable<boolean>;
    smartMacroDocUrl$: Observable<string>;
    smartMacroPanelVisibility$: Observable<boolean>;
    showIframeHider = false;
    smartMacroPanelSizes = {
        left: 100,
        right: 0
    };

    @ViewChild(SplitComponent) split: SplitComponent;

    private selectedMacroSubscription: Subscription;
    private routeSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef,
                public route: ActivatedRoute) {

        this.routeSubscription = route
            .params
            .pipe(
                pluck<{}, string>('id')
            )
            .subscribe(id => store.dispatch(new SelectMacroAction(+id)));

        this.selectedMacroSubscription = store.select(getSelectedMacro)
            .subscribe((macro: Macro) => {
                this.macro = macro;
                this.cdRef.markForCheck();
            });
        this.selectedMacroSubscription = store.select(getSmartMacroPanelWidth)
            .subscribe((width: number) => {
                this.smartMacroPanelSizes = {
                    left: 100 - width,
                    right: width
                };
                this.cdRef.markForCheck();
            });
        this.smartMacroDocUrl$ = store.select(selectSmartMacroDocUrl);
        this.smartMacroPanelVisibility$ = store.select(getSmartMacroPanelVisibility);
        this.isNew = this.route.snapshot.params['empty'] === 'new';
        this.macroPlaybackSupported$ = this.store.select(macroPlaybackSupported);
    }

    ngOnDestroy() {
        this.selectedMacroSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    addAction(macroId: number, action: MacroAction) {
        this.store.dispatch(new AddMacroActionAction({ id: macroId, action }));
    }

    editAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new SaveMacroActionAction({ id: macroId, index, action }));
    }

    deleteAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new DeleteMacroActionAction({ id: macroId, index, action }));
    }

    reorderAction(macroId: number, macroActions: MacroAction[]) {
        this.store.dispatch(new ReorderMacroActionAction({ id: macroId, macroActions }));
    }

    dragStartHandler() {
        this.showIframeHider = true;
    }

    dragEndHandler($event: IOutputData) {
        this.showIframeHider = false;
        this.store.dispatch(new PanelSizeChangedAction($event.sizes[1] as number));
    }

    splitGutterClick({ gutterNum }: IOutputData) {
        // By default, clicking the gutter without changing position does not trigger the 'dragEnd' event
        // This can be fixed by manually notifying the component
        // See issue: https://github.com/angular-split/angular-split/issues/186
        this.split.notify('end', gutterNum);
    }

    toggleSmartMacroDocPanel(): void {
        this.store.dispatch(new TogglePanelVisibilityAction());
    }
}
