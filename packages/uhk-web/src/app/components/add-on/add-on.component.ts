import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPuzzlePiece, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'add-on',
    templateUrl: './add-on.component.html',
    styleUrls: ['./add-on.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class AddOnComponent {
    faPuzzlePiece = faPuzzlePiece;
    faQuestionCircle = faQuestionCircle;

    // speed
    baseSpeed = 1;
    speed = 1;
    acceleration = 0;

    // divisor
    scrollSpeedDivisor = 8;
    caretSpeedDivisor = 16;

    // axis lock
    scrollAxisLock = true;
    caretAxisLock = true;
    axisLockFirstTickSkew = 0.5;
    axisLockSkew = 0.5;

    // misc
    invertScrollDirection = false;

    // key cluster
    keyClusterSwapAxes = false;
    keyClusterInvertHorizontalScrolling = false;

    // Touchpad
    pitchToZoomOptions = [
        {
            value: 'zoom',
            label: 'Zoom'
        },
        {
            value: 'zoomPc',
            label: 'Zoom PC'
        },
        {
            value: 'zoomMac',
            label: 'Zoom Mac'
        },
        {
            value: 'none',
            label: 'None'
        }
    ];
    touchpadPinchToZoom: 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'zoom';
    touchpadPinchZoomDivisor= 4;
    touchpadHoldContinuationTimeout= 4;

    // navigation modes
    navigationModOptions = [
        {
            value: 'cursor',
            label: 'Cursor'
        },
        {
            value: 'media',
            label: 'Media'
        },
        {
            value: 'caret',
            label: 'Caret'
        },
        {
            value: 'zoom',
            label: 'Zoom'
        },
        {
            value: 'zoomPc',
            label: 'Zoom PC'
        },
        {
            value: 'zoomMac',
            label: 'Zoom Mac'
        },
        {
            value: 'none',
            label: 'None'
        }
    ];

    navigationModeBase: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';
    navigationModeMod: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';
    navigationModeMouse: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';
    navigationModeFn: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';
    navigationModeFn2: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';
    navigationModeFn3: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';
    navigationModeFn4: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';
    navigationModeFn5: 'cursor' | 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'cursor';

    constructor(route: ActivatedRoute) {

    }
}
