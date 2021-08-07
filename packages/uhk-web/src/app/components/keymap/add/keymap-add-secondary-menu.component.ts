import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Keymap } from 'uhk-common';

import { AppState, getDefaultUserConfigurationKeymaps } from '../../../store';
import { LoadDefaultUserConfigurationAction } from '../../../store/actions/default-user-configuration.actions';

@Component(({
    selector: 'keymap-add-secondary-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './keymap-add-secondary-menu.component.html',
    styleUrls: ['./keymap-add-secondary-menu.component.scss']
}))
export class KeymapAddSecondaryMenuComponent implements OnInit {
    faKeyboard = faKeyboard;
    keymaps$: Observable<Array<Keymap>>;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.store.dispatch(new LoadDefaultUserConfigurationAction());
        this.keymaps$ = this.store.select(getDefaultUserConfigurationKeymaps);
    }
}
