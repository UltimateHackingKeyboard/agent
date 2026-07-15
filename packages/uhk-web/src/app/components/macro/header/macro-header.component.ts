import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { faCopy, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
    findMacroKeyAssignments,
    Keymap,
    LayerName,
    Macro,
    MacroKeyAssignment,
    MAX_ALLOWED_MACROS_TOOLTIP,
    UserConfiguration
} from 'uhk-common';
import { combineLatest, Subscription } from 'rxjs';

import { DuplicateMacroAction, EditMacroNameAction, RemoveMacroAction } from '../../../store/actions/macro';
import { AppState, getDefaultUserConfiguration, getKeymaps } from '../../../store';
import { MacroKeyAssignmentViewModel } from '../../../models';
import * as util from '../../../util';
import { getDefaultQwertyKeyLabel } from '../../../util/get-default-key-label';
import { AutoGrowInputComponent } from '../../auto-grow-input';
import { initLayerOptions } from '../../../store/reducers/layer-options';
import { MapperService } from '../../../services/mapper.service';

const MACRO_KEY_ASSIGNMENT_SEPARATOR = ' ⭢ ';
const LAYER_OPTIONS = initLayerOptions();

@Component({
    selector: 'macro-header',
    standalone: false,
    templateUrl: './macro-header.component.html',
    styleUrls: ['./macro-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroHeaderComponent implements OnChanges, OnDestroy {
    @Input() macro: Macro;
    @Input() isNew: boolean;
    @Input() maxMacroCountReached: boolean;

    @ViewChild(AutoGrowInputComponent, { static: true }) macroName: AutoGrowInputComponent;

    assignments: MacroKeyAssignmentViewModel[] = [];

    faCopy = faCopy;
    faPlay = faPlay;
    faTrash = faTrash;
    maxAllowedMacrosTooltip = MAX_ALLOWED_MACROS_TOOLTIP;

    private keymaps: Keymap[] = [];
    private defaultUserConfiguration: UserConfiguration;
    private subscriptions = new Subscription();

    constructor(private store: Store<AppState>,
                private mapper: MapperService,
                private cdRef: ChangeDetectorRef) {
        this.subscriptions.add(
            combineLatest([
                this.store.select(getKeymaps),
                this.store.select(getDefaultUserConfiguration),
            ]).subscribe(([keymaps, defaultUserConfiguration]) => {
                this.keymaps = keymaps;
                this.defaultUserConfiguration = defaultUserConfiguration;
                this.updateAssignments();
            })
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.macro) {
            this.macroName.writeValue(changes.macro.currentValue.name as string);
            this.updateAssignments();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getKeymapQueryParams(assignment: MacroKeyAssignmentViewModel) {
        return {
            layer: assignment.layerId,
            module: assignment.moduleId,
            key: assignment.keyId,
        };
    }

    removeMacro() {
        this.store.dispatch(new RemoveMacroAction(this.macro.id));
    }

    duplicateMacro() {
        if (this.maxMacroCountReached)
            return;

        this.store.dispatch(new DuplicateMacroAction(this.macro));
    }

    editMacroName(name: string) {
        if (!util.isValidName(name)) {
            return;
        }

        this.store.dispatch(new EditMacroNameAction({ id: this.macro.id, name }));
    }

    private updateAssignments(): void {
        if (!this.macro || !this.keymaps || !this.defaultUserConfiguration) {
            this.assignments = [];
            this.cdRef.markForCheck();
            return;
        }

        const layerOptions = LAYER_OPTIONS;
        this.assignments = findMacroKeyAssignments(this.keymaps, this.macro.id)
            .sort((first, second) => this.compareAssignments(first, second, layerOptions))
            .map(assignment => {
                const layerName = layerOptions.get(assignment.layerId)?.name ?? LayerName[assignment.layerId];
                const keyLabel = getDefaultQwertyKeyLabel(
                    this.defaultUserConfiguration,
                    assignment.moduleId,
                    assignment.keyId,
                    this.mapper
                );

                return {
                    keymapAbbreviation: assignment.keymapAbbreviation,
                    layerId: assignment.layerId,
                    moduleId: assignment.moduleId,
                    keyId: assignment.keyId,
                    label: `${assignment.keymapName}${MACRO_KEY_ASSIGNMENT_SEPARATOR}${layerName}${MACRO_KEY_ASSIGNMENT_SEPARATOR}${keyLabel}`,
                };
            });

        this.cdRef.markForCheck();
    }

    private compareAssignments(
        first: MacroKeyAssignment,
        second: MacroKeyAssignment,
        layerOptions: ReturnType<typeof initLayerOptions>
    ): number {
        const keymapComparison = first.keymapName.localeCompare(second.keymapName);

        if (keymapComparison !== 0) {
            return keymapComparison;
        }

        const firstLayerOrder = layerOptions.get(first.layerId)?.order ?? 0;
        const secondLayerOrder = layerOptions.get(second.layerId)?.order ?? 0;

        if (firstLayerOrder !== secondLayerOrder) {
            return firstLayerOrder - secondLayerOrder;
        }

        if (first.moduleId !== second.moduleId) {
            return first.moduleId - second.moduleId;
        }

        return first.keyId - second.keyId;
    }
}
