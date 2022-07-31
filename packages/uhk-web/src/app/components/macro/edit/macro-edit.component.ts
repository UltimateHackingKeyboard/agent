import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Macro, MacroAction } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';

import {
    AddMacroActionAction,
    DeleteMacroActionAction,
    ReorderMacroActionAction,
    SaveMacroActionAction,
    SelectMacroActionAction
} from '../../../store/actions/macro';
import {
    AppState,
    getSelectedMacro,
    getSelectedMacroAction,
    getSmartMacroPanelVisibility,
    getSmartMacroPanelWidth,
    isMacroCommandSupported,
    isSelectedMacroNew,
    macroPlaybackSupported,
    maxMacroCountReached,
    selectSmartMacroDocUrl
} from '../../../store';
import { IOutputData, SplitComponent } from 'angular-split';

import { SelectedMacroAction } from '../../../models';
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
    faCaretDown = faCaretDown;
    macro: Macro;
    isNew$: Observable<boolean>;
    macroId: number;
    macroPlaybackSupported$: Observable<boolean>;
    maxMacroCountReached$: Observable<boolean>;
    isMacroCommandSupported$: Observable<boolean>;
    selectedMacroAction$: Observable<SelectedMacroAction>;
    smartMacroDocUrl$: Observable<string>;
    smartMacroPanelVisibility$: Observable<boolean>;
    showIframeHider = false;
    smartMacroPanelSizes = {
        left: 100,
        right: 0
    };

    @ViewChild(SplitComponent) split: SplitComponent;

    private subscriptions = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef,
                public route: ActivatedRoute) {
        this.subscriptions.add(store.select(getSelectedMacro)
            .subscribe((macro: Macro) => {
                this.macro = macro;
                this.cdRef.markForCheck();
            }));

        this.isNew$ = this.store.select(isSelectedMacroNew);
        this.isMacroCommandSupported$ = this.store.select(isMacroCommandSupported);
        this.macroPlaybackSupported$ = this.store.select(macroPlaybackSupported);
        this.maxMacroCountReached$ = store.select(maxMacroCountReached);
        this.subscriptions.add(store.select(getSmartMacroPanelWidth)
            .subscribe((width: number) => {
                this.smartMacroPanelSizes = {
                    left: 100 - width,
                    right: width
                };
                this.cdRef.markForCheck();
            }));
        this.selectedMacroAction$ = store.select(getSelectedMacroAction);
        this.smartMacroDocUrl$ = store.select(selectSmartMacroDocUrl);
        this.smartMacroPanelVisibility$ = store.select(getSmartMacroPanelVisibility);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
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

    onSelectedMacroAction(action: SelectedMacroAction): void {
        this.store.dispatch(new SelectMacroActionAction(action));
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
