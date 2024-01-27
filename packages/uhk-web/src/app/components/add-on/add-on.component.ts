import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPuzzlePiece, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'add-on',
    templateUrl: './add-on.component.html',
    styleUrls: ['./add-on.component.scss'],
    host: {
        'class': 'container-fluid full-screen-component'
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
    touchpadPinchToZoom: 'media' | 'caret' | 'zoom' | 'zoomPc' | 'zoomMac' | 'none' = 'media';
    touchpadPinchZoomDivisor= 4;
    touchpadHoldContinuationTimeout= 4;

    constructor(route: ActivatedRoute) {

    }
}
