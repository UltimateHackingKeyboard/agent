import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {Module} from '../../../config-serializer/config-items/Module';
import {SvgModule, SvgModuleComponent} from '../module';
import {DataProviderService} from '../../../services/data-provider.service';

@Component({
    selector: 'svg-keyboard',
    template: require('./svg-keyboard.component.html'),
    styles: [require('./svg-keyboard.component.scss')],
    directives: [SvgModuleComponent]
})
export class SvgKeyboardComponent implements OnInit {
    @Input() moduleConfig: Module[];
    @Output() keyClick = new EventEmitter();

    private modules: SvgModule[];
    private svgAttributes: { viewBox: string, transform: string, fill: string };

    constructor(private dps: DataProviderService) {
        this.modules = [];
        this.svgAttributes = this.dps.getKeyboardSvgAttributes();
    }

    ngOnInit() {
        this.modules = this.dps.getSvgModules();
    }

    onEditKeyActionRequest(moduleId: number, keyId: number): void {
        this.keyClick.emit({
            moduleId,
            keyId
        });
    }

}
