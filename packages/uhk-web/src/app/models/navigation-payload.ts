import { NavigationExtras } from '@angular/router';

export interface NavigationPayload {
    commands: Array<string>;
    extras?: NavigationExtras;
}
