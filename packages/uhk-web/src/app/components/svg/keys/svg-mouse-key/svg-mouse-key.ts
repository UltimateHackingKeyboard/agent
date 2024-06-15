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
                this.param = 'Backward';
                break;
            case MouseActionParam.button5:
                this.type = 'click';
                this.param = 'Forward';
                break;
            case MouseActionParam.button6:
                this.type = 'click';
                this.param = 'Button 6';
                break;
            case MouseActionParam.button7:
                this.type = 'click';
                this.param = 'Button 7';
                break;
            case MouseActionParam.button8:
                this.type = 'click';
                this.param = 'Button 8';
                break;
            case MouseActionParam.button9:
                this.type = 'click';
                this.param = 'Button 9';
                break;
            case MouseActionParam.button10:
                this.type = 'click';
                this.param = 'Button 10';
                break;
            case MouseActionParam.button11:
                this.type = 'click';
                this.param = 'Button 11';
                break;
            case MouseActionParam.button12:
                this.type = 'click';
                this.param = 'Button 12';
                break;
            case MouseActionParam.button13:
                this.type = 'click';
                this.param = 'Button 13';
                break;
            case MouseActionParam.button14:
                this.type = 'click';
                this.param = 'Button 14';
                break;
            case MouseActionParam.button15:
                this.type = 'click';
                this.param = 'Button 15';
                break;
            case MouseActionParam.button16:
                this.type = 'click';
                this.param = 'Button 16';
                break;
            case MouseActionParam.button17:
                this.type = 'click';
                this.param = 'Button 17';
                break;
            case MouseActionParam.button18:
                this.type = 'click';
                this.param = 'Button 18';
                break;
            case MouseActionParam.button19:
                this.type = 'click';
                this.param = 'Button 19';
                break;
            case MouseActionParam.button20:
                this.type = 'click';
                this.param = 'Button 20';
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
