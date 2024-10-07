import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { isEqual } from 'lodash';
import { Macro, MacroAction } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';

import {
    AddMacroActionAction,
    DuplicateMacroActionAction,
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

import { DuplicateMacroActionPayload, SelectedMacroAction, SelectedMacroActionIdModel } from '../../../models';
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
    selectedMacroActionIdModel: SelectedMacroActionIdModel;
    showIframeHider = false;
    smartMacroPanelSizes = {
        left: 100,
        right: 0
    };

    @ViewChild(SplitComponent) split: SplitComponent;

    private backUrl: string;
    private backUrlText: string;
    private subscriptions = new Subscription();

    constructor(private store: Store<AppState>,
                private cdRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router) {
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
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            this.backUrl = params.backUrl;
            this.backUrlText = params.backText;

            if (params.actionIndex) {
                if (params.actionIndex === 'new') {
                    this.selectedMacroActionIdModel = {
                        id: params.actionIndex
                    };
                } else {
                    this.selectedMacroActionIdModel = {
                        id: +params.actionIndex,
                        inlineEdit: params.inlineEdit === 'true'
                    };
                }
            } else {
                this.selectedMacroActionIdModel = undefined;
            }
            this.cdRef.markForCheck();
        }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    addAction(macroId: number, action: MacroAction) {
        this.store.dispatch(new AddMacroActionAction({ id: macroId, action }));
        this.hideActiveEditor();
    }

    editAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new SaveMacroActionAction({ id: macroId, index, action }));
        this.hideActiveEditor();
    }

    deleteAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new DeleteMacroActionAction({ id: macroId, index, action }));
    }

    duplicateAction(payload: DuplicateMacroActionPayload) {
        this.store.dispatch(new DuplicateMacroActionAction(payload));
    }

    reorderAction(macroId: number, macroActions: MacroAction[]) {
        this.store.dispatch(new ReorderMacroActionAction({ id: macroId, macroActions }));
    }

    onSelectedMacroAction(action: SelectedMacroAction): void {
        this.onSelectedMacroActionIdChanged(action);
        this.store.dispatch(new SelectMacroActionAction(action));
    }

    onSelectedMacroActionIdChanged(model: SelectedMacroActionIdModel): void {
        if (isEqual(model, this.selectedMacroActionIdModel)) {
            return;
        }

        this.router.navigate([], {
            queryParams: {
                actionIndex: model?.id,
                backText: this.backUrlText,
                backUrl: this.backUrl,
                inlineEdit: model?.inlineEdit
            }
        });
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

    private hideActiveEditor(): void {
        if (!this.selectedMacroActionIdModel?.inlineEdit) {
            this.router.navigate([], {
                queryParams: {
                    backText: this.backUrlText,
                    backUrl: this.backUrl,
                },
            });
        }
    }
}
