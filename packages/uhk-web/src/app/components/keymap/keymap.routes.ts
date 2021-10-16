import { Routes } from '@angular/router';

import { KeymapAddComponent } from './add/keymap-add.component';
import { KeymapAddSecondaryMenuComponent } from './add/keymap-add-secondary-menu.component';
import { KeymapEditComponent } from './edit';
import { KeymapEditGuard } from './edit';
import { KeymapAddEmptyComponent } from './add/keymap-add-empty.component';

export const keymapRoutes: Routes = [
    {
        path: '',
        redirectTo: 'keymap',
        pathMatch: 'full'
    },
    {
        path: 'keymap',
        component: KeymapEditComponent,
        canActivate: [KeymapEditGuard]
    },
    {
        path: 'keymap/add',
        component: KeymapAddComponent
    },
    {
        path: 'add-keymap',
        component: KeymapAddEmptyComponent,
        data: { secondMenuComponent: KeymapAddSecondaryMenuComponent }
    },
    {
        path: 'add-keymap/:newKeymapAbbr',
        component: KeymapAddComponent,
        data: { secondMenuComponent: KeymapAddSecondaryMenuComponent }
    },
    {
        path: 'keymap/:abbr',
        component: KeymapEditComponent
    }
];
