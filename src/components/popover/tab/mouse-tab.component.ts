import { Component, OnInit, Renderer} from '@angular/core';
import {NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';

import { KeyActionSaver } from '../key-action-saver';
import {MouseAction, MouseActionParam} from '../../../../config-serializer/config-items/MouseAction';

@Component({
    moduleId: module.id,
    selector: 'mouse-tab',
    template:
    `
        <div class="mouse-action col-sm-4">
            <ul class="nav nav-pills nav-stacked">
                <li (click)="changePage(0)" [ngClass]="{active: selectedIndex===0}"><a>     Move    </a></li>
                <li (click)="changePage(1)" [ngClass]="{active: selectedIndex===1}"><a>     Scroll  </a></li>
                <li (click)="changePage(2)" [ngClass]="{active: selectedIndex===2}"><a>     Click   </a></li>
                <li (click)="changePage(3)" [ngClass]="{active: selectedIndex===3}"><a>     Speed   </a></li>
            </ul>
        </div>
        <div class="details col-sm-8" [ngSwitch]="selectedIndex">
            <div *ngSwitchWhen="0" class="mouse__config mouse__config--move text-center">
                <div class="row">
                    <button type="button" class="btn btn-default btn-lg"
                            (click)="onMouseActionClick($event.target, MouseActionParam.moveUp)">
                        <i class="fa fa-arrow-up"></i>
                    </button>
                </div>
                <div class="row">
                    <button type="button" class="btn btn-default btn-lg"
                            (click)="onMouseActionClick($event.target, MouseActionParam.moveLeft)">
                        <i class="fa fa-arrow-left"></i>
                    </button>
                    <button type="button" class="btn btn-default btn-lg btn-placeholder">
                        <i class="fa fa-square"></i>
                    </button>
                    <button type="button" class="btn btn-default btn-lg"
                            (click)="onMouseActionClick($event.target, MouseActionParam.moveRight)">
                        <i class="fa fa-arrow-right"></i>
                    </button>
                </div>
                <div class="row">
                    <button type="button" class="btn btn-default btn-lg"
                            (click)="onMouseActionClick($event.target, MouseActionParam.moveDown)">
                        <i class="fa fa-arrow-down"></i>
                    </button>
                </div>
            </div>
            <div *ngSwitchWhen="1" class="mouse__config mouse__config--scroll text-center">
                <div class="row">
                    <button type="button" class="btn btn-default btn-lg"
                            (click)="onMouseActionClick($event.target, MouseActionParam.scrollUp)">
                        <i class="fa fa-angle-double-up"></i>
                    </button>
                </div>
                <div class="row">
                    <button type="button" class="btn btn-default btn-lg"
                            (click)="onMouseActionClick($event.target, MouseActionParam.scrollLeft)">
                        <i class="fa fa-angle-double-left"></i>
                    </button>
                    <button type="button" class="btn btn-default btn-lg btn-placeholder">
                        <i class="fa fa-square"></i>
                    </button>
                    <button type="button" class="btn btn-default btn-lg"
                        (click)="onMouseActionClick($event.target, MouseActionParam.scrollRight)">
                        <i class="fa fa-angle-double-right"></i>
                    </button>
                </div>
                <div class="row">
                    <button type="button" class="btn btn-default btn-lg"
                        (click)="onMouseActionClick($event.target, MouseActionParam.scrollDown)">
                        <i class="fa fa-angle-double-down"></i>
                    </button>
                </div>
            </div>
            <div *ngSwitchWhen="2" class="mouse__config mouse__config--click">
                <div class="btn-group col-xs-12" role="group">
                    <button type="button" class="btn btn-default col-xs-4"
                            (click)="onMouseActionClick($event.target, MouseActionParam.leftClick)">Left</button>
                    <button type="button" class="btn btn-default col-xs-4"
                            (click)="onMouseActionClick($event.target, MouseActionParam.middleClick)">Middle</button>
                    <button type="button" class="btn btn-default col-xs-4"
                            (click)="onMouseActionClick($event.target, MouseActionParam.rightClick)">Right</button>
                </div>
            </div>
            <div *ngSwitchWhen="3" class="mouse__config mouse__config--speed text-center">
                <div class="help-text--mouse-speed text-left">
                    <p>Press this key along with mouse movement/scrolling to accelerate/decelerate the speed of the action.</p>
                    <p>You can set the multiplier in <a href="#" title="link to the setting">link to setting</a>.</p>
                </div>
                <div class="btn-group btn-group-lg" role="group">
                    <button type="button" class="btn btn-default"
                        (click)="onMouseActionClick($event.target, MouseActionParam.decelerate)">-</button>
                    <button type="button" class="btn btn-default"
                        (click)="onMouseActionClick($event.target, MouseActionParam.accelerate)">+</button>
                </div>
            </div>
            <div *ngSwitchDefault>
            </div>
        </div>
    `,
    styles: [require('./mouse-tab.component.scss')],
    directives: [NgSwitch, NgSwitchWhen, NgSwitchDefault]
})
export class MouseTabComponent implements OnInit, KeyActionSaver {
    private mouseActionParam: MouseActionParam;
    private selectedIndex: number;
    private selectedButton: HTMLButtonElement;

    constructor(private renderer: Renderer) {
        this.selectedIndex = 0;
    }

    ngOnInit() { }

    keyActionValid(): boolean {
        return !!this.mouseActionParam;
    }

    toKeyAction(): MouseAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected mouse action!');
        }
        let mouseAction: MouseAction = new MouseAction();
        mouseAction.mouseAction = this.mouseActionParam;
        return mouseAction;
    }

    changePage(index: number) {
        if (index < -1 || index > 3) {
            console.error(`Invalid index error: ${index}`);
            return;
        }
        this.selectedIndex = index;
        this.mouseActionParam = undefined;
        this.selectedButton = undefined;
    }

    onMouseActionClick(target: HTMLButtonElement, mouseActionParam: MouseActionParam) {
        if (this.selectedButton) {
            this.renderer.setElementClass(this.selectedButton, 'btn-primary', false);
        }
        this.selectedButton = target;
        this.renderer.setElementClass(target, 'btn-primary', true);
        this.mouseActionParam = mouseActionParam;
    }

}
