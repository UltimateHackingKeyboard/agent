import {
    Component,
    OnInit,
    AfterViewInit,
    Output,
    EventEmitter,
    ViewChildren,
    ElementRef,
    Renderer,
    QueryList,
    ChangeDetectorRef
} from '@angular/core';

import {NgSwitch, NgSwitchWhen} from '@angular/common';

import {KeypressEditComponent} from './keypress-edit.component';

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
                <div class="popover-content">
                    <keypress-edit *ngSwitchWhen="0"></keypress-edit>
                    <div *ngSwitchWhen="1"> Layer </div>
                    <div *ngSwitchWhen="2"> Mouse </div>
                    <div *ngSwitchWhen="3"> Macro </div>
                    <div *ngSwitchWhen="4"> Keymap </div>
                    <div *ngSwitchWhen="5"> None </div>
                </div>
            </div>
            <div class="row">
                <div class="popover-action">
                    <button class="btn btn-sm btn-default" type="button" (click)="onCancelClick()"> Cancel </button>
                    <button class="btn btn-sm btn-primary" type="button" (click)="onRemapKey()"> Remap Key </button>
                </div>
            </div>
        </div>
    `,
    styles:
    [`
        :host {
            display: flex;
            flex-direction: column;
            min-width: 577px;
            padding: 0;
        }

        .popover-action {
            padding: 8px 14px;
            margin: 0;
            font-size: 14px;
            background-color: #f7f7f7;
            border-top: 1px solid #ebebeb;
            border-radius: 0 0 5px 5px;
            text-align: right;
        }

        .popover-title.menu-tabs {
            padding: .5rem .5rem 0;
            display: block;
        }

        .popover-title.menu-tabs .nav-tabs {
            position: relative;
            top: 1px;
        }

        .popover-content {
            padding: 10px 24px;
        }
    `],
    host: { 'class': 'popover' },
    directives: [NgSwitch, NgSwitchWhen, KeypressEditComponent]
})
export class PopoverComponent implements OnInit, AfterViewInit {
    @Output() cancel = new EventEmitter<any>();
    @ViewChildren('keypress,layer,mouse,macro,keymap,none') liElementRefs: QueryList<ElementRef>;

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
