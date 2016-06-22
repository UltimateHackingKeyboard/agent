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

import {KeypressTabComponent} from './tab/keypress-tab.component';
import {LayerTabComponent} from './tab/layer-tab.component';
import {MouseTabComponent} from './tab/mouse-tab.component';
import {MacroTabComponent} from './tab/macro-tab.component';
import {KeymapTabComponent} from './tab/keymap-tab.component';
import {NoneTabComponent} from './tab/none-tab.component';

import {KeyActionSaver} from './key-action-saver';

@Component({
    moduleId: module.id,
    selector: 'popover',
    template:
    `
        <div class="container-fluid">
            <div class="row">
                <div class="popover-title menu-tabs">
                    <ul class="nav nav-tabs popover-menu">
                        <li #keypress (click)="onListItemClick(0)">
                            <a class="menu-tabs--item">
                                <i class="fa fa-keyboard-o"></i>
                                Keypress
                            </a>
                        </li>
                        <li #layer (click)="onListItemClick(1)">
                            <a class="menu-tabs--item">
                                <i class="fa fa-clone"></i>
                                Layer
                            </a>
                        </li>
                        <li #mouse (click)="onListItemClick(2)">
                            <a class="menu-tabs--item">
                                <i class="fa fa-mouse-pointer"></i>
                                Mouse
                            </a>
                        </li>
                        <li #macro (click)="onListItemClick(3)">
                            <a class="menu-tabs--item">
                                <i class="fa fa-play"></i>
                                Macro
                            </a>
                        </li>
                        <li #keymap (click)="onListItemClick(4)">
                            <a class="menu-tabs--item">
                                <i class="fa fa-keyboard-o"></i>
                                Keymap
                            </a>
                        </li>
                        <li #none (click)="onListItemClick(5)">
                            <a class="menu-tabs--item">
                                <i class="fa fa-ban"></i>
                                None
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="row" [ngSwitch]="activeListItemIndex">
                <keypress-tab #tab *ngSwitchCase="0" class="popover-content"></keypress-tab>
                <layer-tab #tab *ngSwitchCase="1" class="popover-content"></layer-tab>
                <mouse-tab #tab *ngSwitchCase="2" class="popover-content"></mouse-tab>
                <macro-tab #tab *ngSwitchCase="3" class="popover-content"></macro-tab>
                <keymap-tab #tab *ngSwitchCase="4" class="popover-content"></keymap-tab>
                <none-tab #tab *ngSwitchCase="5" class="popover-content"></none-tab>
            </div>
            <div class="row">
                <div class="popover-action">
                    <button class="btn btn-sm btn-default" type="button" (click)="onCancelClick()"> Cancel </button>
                    <button class="btn btn-sm btn-primary" type="button" (click)="onRemapKey()"> Remap Key </button>
                </div>
            </div>
        </div>
    `,
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
