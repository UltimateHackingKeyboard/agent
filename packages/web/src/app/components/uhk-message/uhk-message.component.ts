import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'uhk-message',
    templateUrl: 'uhk-message.component.html',
    styleUrls: ['uhk-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UhkMessageComponent {
    @Input() title: string;
    @Input() subtitle: string;
}
