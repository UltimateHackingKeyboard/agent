import {
    Component,
    OnInit,
    AfterViewInit,
    Output,
    EventEmitter,
    ViewChild,
    ViewChildren,
    ElementRef,
    Renderer,
    QueryList,
    ChangeDetectorRef
} from '@angular/core';

import {NgSwitch, NgSwitchCase} from '@angular/common';

import {KeyAction} from '../../../config-serializer/config-items/KeyAction';

import {KeypressTabComponent} from './tab/keypress/keypress-tab.component';
import {LayerTabComponent} from './tab/layer/layer-tab.component';
import {MouseTabComponent} from './tab/mouse/mouse-tab.component';
import {MacroTabComponent} from './tab/macro/macro-tab.component';
import {KeymapTabComponent} from './tab/keymap/keymap-tab.component';
import {NoneTabComponent} from './tab/none/none-tab.component';

import {KeyActionSaver} from './key-action-saver';

@Component({
    moduleId: module.id,
    selector: 'popover',
    template: require('./popover.component.html'),
    styles: [require('./popover.component.scss')],
    host: { 'class': 'popover' },
    directives:
    [
        NgSwitch,
        NgSwitchCase,
        KeypressTabComponent,
        LayerTabComponent,
        MouseTabComponent,
        MacroTabComponent,
        KeymapTabComponent,
        NoneTabComponent
    ]
})
export class PopoverComponent implements OnInit, AfterViewInit {

    @Output() cancel = new EventEmitter<any>();
    @Output() remap = new EventEmitter<KeyAction>();

    @ViewChildren('keypress,layer,mouse,macro,keymap,none') liElementRefs: QueryList<ElementRef>;
    @ViewChild('tab') selectedTab: KeyActionSaver;

    private activeListItemIndex: number;

    constructor(private renderer: Renderer, private changeDetectorRef: ChangeDetectorRef) {
        this.activeListItemIndex = -1;
    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.onListItemClick(0);
        this.changeDetectorRef.detectChanges();
    }

    onCancelClick(): void {
        this.cancel.emit(undefined);
    }

    onRemapKey(): void {
        try {
            let keyAction = this.selectedTab.toKeyAction();
            this.remap.emit(keyAction);
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    onListItemClick(index: number): void {
        let listItems: HTMLLIElement[] = this.liElementRefs.toArray().map(liElementRef => liElementRef.nativeElement);
        if (this.activeListItemIndex >= 0) {
            this.renderer.setElementClass(listItems[this.activeListItemIndex], 'active', false);
        }
        this.renderer.setElementClass(listItems[index], 'active', true);
        this.activeListItemIndex = index;
    }

}
