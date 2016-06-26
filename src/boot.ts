import { bootstrap } from '@angular/platform-browser-dynamic';

import { MainAppComponent } from './main-app.component';

import { DataProviderService } from './services/data-provider.service';
import { MapperService } from './services/mapper.service';
import { APP_ROUTER_PROVIDERS } from './main-app.routes';

process.stdout = require('browser-stdout')();

bootstrap(MainAppComponent, [
    DataProviderService,
    MapperService,
    APP_ROUTER_PROVIDERS
]).catch(err => console.error(err));
