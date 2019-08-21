import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';

import { MouseAction, MouseActionParam } from 'uhk-common';

@Component({
    selector: 'g[svg-mouse-key]',
    templateUrl: './svg-mouse-key.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgMouseKeyComponent implements OnChanges {
    @Input() mouseAction: MouseAction;
    type: 'click' | 'scroll' | 'move' | 'speed';
    param: any;

    constructor() { }

    ngOnChanges() {
        switch (this.mouseAction.mouseAction) {
            case MouseActionParam.leftClick:
                this.type = 'click';
                this.param = 'Left';
                break;
            case MouseActionParam.rightClick:
                this.type = 'click';
                this.param = 'Right';
                break;
            case MouseActionParam.middleClick:
                this.type = 'click';
                this.param = 'Middle';
                break;
            case MouseActionParam.button4:
                this.type = 'click';
                this.param = '4';
                break;
            case MouseActionParam.button5:
                this.type = 'click';
                this.param = '5';
                break;
            case MouseActionParam.button6:
                this.type = 'click';
                this.param = '6';
                break;
            case MouseActionParam.button7:
                this.type = 'click';
                this.param = '7';
                break;
            case MouseActionParam.button8:
                this.type = 'click';
                this.param = '8';
                break;
            case MouseActionParam.scrollDown:
                this.type = 'scroll';
                this.param = 'down';
                break;
            case MouseActionParam.scrollLeft:
                this.type = 'scroll';
                this.param = 'left';
                break;
            case MouseActionParam.scrollRight:
                this.type = 'scroll';
                this.param = 'right';
                break;
            case MouseActionParam.scrollUp:
                this.type = 'scroll';
                this.param = 'up';
                break;
            case MouseActionParam.moveDown:
                this.type = 'move';
                this.param = 'down';
                break;
            case MouseActionParam.moveLeft:
                this.type = 'move';
                this.param = 'left';
                break;
            case MouseActionParam.moveRight:
                this.type = 'move';
                this.param = 'right';
                break;
            case MouseActionParam.moveUp:
                this.type = 'move';
                this.param = 'up';
                break;
            case MouseActionParam.accelerate:
                this.type = 'speed';
                this.param = true;
                break;
            case MouseActionParam.decelerate:
                this.type = 'speed';
                this.param = false;
                break;
            default:
                break;
        }
    }
}
