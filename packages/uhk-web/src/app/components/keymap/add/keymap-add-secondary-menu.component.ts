import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Keymap } from 'uhk-common';

import { AppState, getDefaultUserConfigurationKeymaps } from '../../../store';

@Component(({
    selector: 'keymap-add-secondary-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    templateUrl: './keymap-add-secondary-menu.component.html',
    styleUrls: ['./keymap-add-secondary-menu.component.scss']
}))
export class KeymapAddSecondaryMenuComponent {
    faKeyboard = faKeyboard;
    keymaps$: Observable<Array<Keymap>> = this.store.select(getDefaultUserConfigurationKeymaps);

    constructor(private store: Store<AppState>) {
    }
}
