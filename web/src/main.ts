import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

if (!process.stdout) {
    process.stdout = require('browser-stdout')();
}

platformBrowserDynamic().bootstrapModule(AppModule);
