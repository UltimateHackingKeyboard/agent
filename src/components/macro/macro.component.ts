import { Macro } from '../../config-serializer/config-items/Macro';
import { TextMacroAction } from '../../config-serializer/config-items/macro-action/TextMacroAction';
import { UhkConfigurationService } from '../../services/uhk-configuration.service';
import { MacroItemComponent } from './macro-item/macro-item.component';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'macro',
    template: require('./macro.component.html'),
    styles: [require('./macro.component.scss')],
    viewProviders: [DragulaService]
})
export class MacroComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren(MacroItemComponent) macroItems: QueryList<MacroItemComponent>;

    private macro: Macro;

    private sub: Subscription;
    private macroItemsSub: Subscription;
    private addedNewAction: boolean = false;
    private hasChanges: boolean = false;
    private dragEnabled: boolean;

    constructor(
        private uhkConfigurationService: UhkConfigurationService,
        private route: ActivatedRoute,
        private dragulaService: DragulaService
    ) {
        /* tslint:disable:no-unused-variable: Used by Dragula. */
        dragulaService.setOptions('macroActions', {
            moves: function (el: any, container: any, handle: any) {
                return handle.className.indexOf('action--movable') !== -1;
            }
        });
        /* tslint:enable:no-unused-variable */
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params: any) => {
            const id: number = Number(params.id);
            this.macro = this.getMacro(id);
            this.dragEnabled = true;
            this.hasChanges = false;
       });
    }

    ngAfterViewInit() {
       this.macroItemsSub = this.macroItems.changes.subscribe((data: any) => {
           if (this.addedNewAction) {
               // Open editor for newly added action
               // Rather cludge way to do this, basically macroItems have to be updated before the editor can be opened
               setTimeout(() => {
                   let newAction = data.last;
                   newAction.title = 'New macro action';
                   newAction.actionEditor.toggleEnabled(true);
                   this.hideOtherActionEditors(data.length - 1);
                   this.addedNewAction = false;
               });
           }
       });
    }

    getMacro(id: number) {
        const config = this.uhkConfigurationService.getUhkConfiguration();
        const macro: Macro = config.macros.elements.find(item => item.id === id);
        if (macro) {
            // Clone macro for editing
            return new Macro().fromJsObject(macro.toJsObject());
        }
        // @todo replace with notification
        throw new Error('Macro not found');
    }

    saveMacro() {
        // @todo Save macro to keyboard
    }

    addAction() {
        const newAction = new TextMacroAction();
        newAction.text = '';
        this.macro.macroActions.elements.push(newAction);
        this.addedNewAction = true;
    }

    discardChanges() {
        const id: number = this.macro.id;
        this.macro = this.getMacro(id);
        this.hasChanges = false;
    }

    hideOtherActionEditors(index: number) {
        this.macroItems.toArray().forEach((macroItem: MacroItemComponent, idx: number) => {
            if (idx !== index) {
                macroItem.actionEditor.toggleEnabled(false);
            }
        });
    }

    onNameChange() {
        this.hasChanges = true;
    }

    onEditAction(index: number) {
        // Hide other editors when clicking edit button of a macro action
        this.hideOtherActionEditors(index);
        this.dragEnabled = false;
    }

    onCancelEditAction() {
      this.dragEnabled = true;
    }

    onSaveAction() {
      this.dragEnabled = true;
      this.hasChanges = true;
    }

    onDeleteAction(index: number) {
        // @ todo show confirm action dialog
        this.macro.macroActions.elements.splice(index, 1);
        this.hasChanges = true;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.macroItemsSub.unsubscribe();
    }

}
