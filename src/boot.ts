import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';

import { MainAppComponent } from './main-app.component';

import {DataProviderService} from './services/data-provider.service';

process.stdout = require('browser-stdout')();

bootstrap(MainAppComponent, [
    HTTP_PROVIDERS,
    DataProviderService
]).catch(err => console.error(err));
