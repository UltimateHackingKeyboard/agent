import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

process.stdout = require('browser-stdout')();

platformBrowserDynamic().bootstrapModule(AppModule);
