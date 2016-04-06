///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';

import { MainAppComponent } from './main-app.component';

bootstrap(MainAppComponent, [
    HTTP_PROVIDERS
]).catch(err => console.error(err));