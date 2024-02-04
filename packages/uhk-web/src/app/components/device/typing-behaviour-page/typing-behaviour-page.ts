import { Component } from '@angular/core';
import { faQuestionCircle, faSlidersH } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'typing-behaviour-page',
    templateUrl: './typing-behaviour-page.html',
    styleUrls: ['./typing-behaviour-page.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class TypingBehaviourPage {
    faSlidersH = faSlidersH;
    faQuestionCircle = faQuestionCircle;

    secondaryRoleResolutionStrategy: 'simple' | 'advanced' = 'simple';
    secondaryRoleTimeout = 350;
    secondaryRoleTimeoutAction: 'primary' | 'secondary' = 'secondary';
    secondaryRoleTriggerByRelease = true;
    secondaryRoleTriggerSafetyMargin = 50;
    secondaryRoleDoubleTapPrimary = true;
    secondaryRoleDoubleTapTimeout = 200;

    miscDoubleTapLockLayerTimeout = 400;
    miscKeystrokeDelay = 0;

    onInputRadioChanged(property: string, value: any) {
        this[property] = value;
    }
}
