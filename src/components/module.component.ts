import { Component, OnInit, Input, DynamicComponentLoader, ElementRef, ComponentRef } from 'angular2/core';

import {KeyboardButton} from './keyboard-button.model';
import {KeyboardButtonGroupComponent} from './keyboard-button-group.component';

@Component({
    selector: 'module',
    template:
    `
        <div #row></div>
    `,
    styles:
    [`
        :host {
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: column;
        }
    `]
})
export class ModuleComponent implements OnInit {
    @Input() case: any;
    @Input() keyboardButtons: KeyboardButton[];
    @Input() fill: string;

    constructor(private dcl: DynamicComponentLoader, private elementRef: ElementRef) {
        this.keyboardButtons = [];
    }

    ngOnInit() {
        this.getButtonGroups().forEach(buttonGroup => {
            this.dcl.loadIntoLocation(KeyboardButtonGroupComponent, this.elementRef, "row").then((bttnComponentRef: ComponentRef) => {
                var group: KeyboardButtonGroupComponent = bttnComponentRef.instance;
                group.keyboardButtons = buttonGroup;
                //  console.log(keyboardButtonComponent);
            });
        });
    }


    private getButtonGroups(): KeyboardButton[][] {
        var buttonGroups: KeyboardButton[][] = [];
        var buttonGroup: KeyboardButton[] = [];
        this.keyboardButtons.forEach((keyboardButton, index) => {
            if (buttonGroup.length > 0 && buttonGroup[buttonGroup.length - 1].y !== keyboardButton.y) {
                buttonGroups.push(buttonGroup);
                buttonGroup = [];
            }
            buttonGroup.push(keyboardButton);
        });
        //console.log(buttonGroups, buttonGroup, this.keyboardButtons);
        return buttonGroups;
    }

}