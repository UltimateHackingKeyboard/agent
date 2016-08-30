import {
    Component, 
    OnInit, 
    Input, 
    Output, 
    EventEmitter, 
    ElementRef, 
    ViewChild
} from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';
import {MouseTabComponent } from '../../../../popover/tab/mouse/mouse-tab.component';
import {MacroAction, macroActionType} from '../../../../../../config-serializer/config-items/MacroAction';

@Component({
    moduleId: module.id,
    selector: 'macro-mouse-tab',
    template: require('./macro-mouse.component.html'),
    styles: [require('./macro-mouse.component.scss')],
    host: { 'class': 'macro__mouse' },
    directives: [ FORM_DIRECTIVES ]
})
export class MacroMouseTabComponent implements OnInit {
    @ViewChild('macroDirectionX') directionX: ElementRef;
    @ViewChild('macroDirectionY') directionY: ElementRef;
 
    private macroAction: MacroAction;

    constructor() {
        
    }

    ngOnInit() {
    }

}