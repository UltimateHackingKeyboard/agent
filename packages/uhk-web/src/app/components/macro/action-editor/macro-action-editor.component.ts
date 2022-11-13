import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { faCode, faClock, faFont, faKeyboard, faMousePointer } from '@fortawesome/free-solid-svg-icons';

import {
    CommandMacroAction,
    MacroAction,
    DelayMacroAction,
    KeyMacroAction,
    ScrollMouseMacroAction,
    MoveMouseMacroAction,
    MouseButtonMacroAction,
    TextMacroAction,
    MacroActionHelper
} from 'uhk-common';

import { SelectedMacroActionId, TabName } from '../../../models';

import {
    MacroDelayTabComponent,
    MacroMouseTabComponent,
    MacroKeyTabComponent,
    MacroTextTabComponent,
    MacroCommandComponent
} from './tab';

@Component({
    selector: 'macro-action-editor',
    templateUrl: './macro-action-editor.component.html',
    styleUrls: ['./macro-action-editor.component.scss'],
    host: { 'class': 'macro-action-editor' }
})
export class MacroActionEditorComponent implements AfterViewInit, OnInit, OnChanges {
    @Input() macroAction: MacroAction;
    @Input() index: SelectedMacroActionId;
    @Input() isActive: boolean;
    @Input() isMacroCommandSupported: boolean;

    @Output() save = new EventEmitter<MacroAction>();
    @Output() cancel = new EventEmitter<void>();
    @Output() tabChanged = new EventEmitter<TabName>();

    // tslint:disable-next-line:max-line-length
    @ViewChild('tab', { static: false }) selectedTab: MacroCommandComponent | MacroTextTabComponent | MacroKeyTabComponent | MacroMouseTabComponent | MacroDelayTabComponent;

    editableMacroAction: MacroAction;
    activeTab: TabName;
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    TabName = TabName;
    /* tslint:enable:variable-name */
    isSelectedMacroValid = false;
    faFont = faFont;
    faKeyboard = faKeyboard;
    faMousePointer = faMousePointer;
    faClock = faClock;
    faCode = faCode;

    constructor(private _cdRef: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        const isValid = this.selectedTab && this.selectedTab.isMacroValid();
        if (isValid !== this.isSelectedMacroValid) {
            this.isSelectedMacroValid = isValid;
            this._cdRef.detectChanges();
        }
    }

    ngOnInit() {
        this.updateEditableMacroAction();
        const tab: TabName = this.getTabName(this.editableMacroAction);
        if (this.activeTab !== tab) {
            this.activeTab = tab;
            setTimeout(() => this.tabChanged.emit(tab));
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.macroAction) {
            this.ngOnInit();
        }
    }

    onCancelClick(): void {
        this.cancel.emit();
    }

    @HostListener('document:keydown.control.enter', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.isSelectedMacroValid) {
            this.onSaveClick();
            event.preventDefault();
        }
    }

    onSaveClick(): void {
        try {
            // TODO: Refactor after getKeyMacroAction has been added to all tabs
            const action = this.selectedTab instanceof MacroKeyTabComponent ?
                this.selectedTab.getKeyMacroAction() :
                this.selectedTab.macroAction;
            this.save.emit(action);
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    onValid(isMacroValid: boolean) {
        if (isMacroValid === this.isSelectedMacroValid) {
            return this.isSelectedMacroValid;
        }

        this.isSelectedMacroValid = isMacroValid;
        this._cdRef.detectChanges();

        return this.isSelectedMacroValid;
    }

    selectTab(tab: TabName): void {
        this.activeTab = tab;
        this.tabChanged.emit(tab);
        if (tab === this.getTabName(this.macroAction)) {
            this.updateEditableMacroAction();
        } else {
            this.editableMacroAction = undefined;
            this.isSelectedMacroValid = false;
            this._cdRef.detectChanges();
        }
    }

    getTabName(action: MacroAction): TabName {
        if (action instanceof DelayMacroAction) {
            return TabName.Delay;
        } else if (action instanceof TextMacroAction) {
            return TabName.Text;
        } else if (action instanceof KeyMacroAction) {
            return TabName.Keypress;
        } else if (action instanceof MouseButtonMacroAction ||
            action instanceof MoveMouseMacroAction ||
            action instanceof ScrollMouseMacroAction) {
            return TabName.Mouse;
        } else if (action instanceof CommandMacroAction) {
            return TabName.Command;
        }
        return undefined;
    }

    onMacroEditorGotFocus(): void {
        this.tabChanged.emit(this.activeTab);
    }

    onMacroEditorCtrlEnterKeydown(): void {
        if (this.isSelectedMacroValid) {
            this.onSaveClick();
        }
    }

    private updateEditableMacroAction() {
        const macroAction: MacroAction = this.macroAction ? this.macroAction : new TextMacroAction();
        this.editableMacroAction = MacroActionHelper.createMacroAction(macroAction);
    }

}
