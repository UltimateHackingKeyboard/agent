import { bootstrap } from '@angular/platform-browser-dynamic';

import { MainAppComponent } from './main-app.component';

import {DataProviderService} from './services/data-provider.service';
import {MapperService} from './services/mapper.service';

process.stdout = require('browser-stdout')();

bootstrap(MainAppComponent, [
    DataProviderService,
    MapperService
]).catch(err => console.error(err));
