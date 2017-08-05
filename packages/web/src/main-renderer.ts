import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AgentRendererModule } from './agent-renderer/agent-renderer.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AgentRendererModule);
