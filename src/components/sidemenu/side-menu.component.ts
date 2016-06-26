import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { UhkConfigurationService } from '../../services/uhk-configuration.service';
import { Macro } from '../../../config-serializer/config-items/Macro';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'side-menu',
    template: require('./side-menu.component.html'),
    styles: [require('./side-menu.component.scss')],
    providers: [UhkConfigurationService],
    directives: [ROUTER_DIRECTIVES]
})
export class SideMenuComponent implements OnInit {
    @ViewChild('keymapElement') keymapElement: ElementRef;
    @ViewChild('macroElement') macroElement: ElementRef;
    @ViewChild('addonElement') addonElement: ElementRef;

    private keymaps: Keymap[];
    private macros: Macro[];

    constructor(private uhkConfigurationService: UhkConfigurationService) {
    }

    ngOnInit() {
        this.keymaps = this.uhkConfigurationService.getUhkConfiguration().keymaps.elements;
        this.macros = this.uhkConfigurationService.getUhkConfiguration().macros.elements;
    }

    private toggleHide(event: Event, view: ElementRef) {
        let classesToggle: string[] = event.srcElement.className.split(' ');
        let classesView: string[] = view.nativeElement.className.split(' ');
        let position: number = classesToggle.indexOf('fa-chevron-up');

        // Slide up
        if (position > -1) {
            classesToggle.splice(position, 1);
            classesToggle.push('fa-chevron-down');
            classesView.push('slide-up');
        }
        // Slide down
        else {
            classesToggle.splice(classesToggle.indexOf('fa-chevron-down'), 1);
            classesToggle.push('fa-chevron-up');

            let positionView: number = classesView.indexOf('slide-up');
            classesView.splice(positionView, 1);
        }

        event.srcElement.className = classesToggle.join(' ');
        view.nativeElement.className = classesView.join(' ');
    }
}
