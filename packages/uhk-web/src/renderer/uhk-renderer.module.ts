import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from 'uhk-common';
// import { ElectronDataStorageRepositoryService } from './services/electron-datastorage-repository.service';
import { ElectronLogService } from './services/electron-log.service';
import { ElectronErrorHandlerService } from './services/electron-error-handler.service';
import { UhkHidApiService } from './services/uhk-hid-api.service';
import { uhkDeviceFactory } from './services/uhk-device-provider';
import { UhkDeviceService } from './services/uhk-device.service';
import { WebModule } from '../app/web.module';
import { appRoutingProviders, routing } from '../app/app.routes';
import { MainAppComponent } from '../app/app.component';
// import { DATA_STORAGE_REPOSITORY } from './services/datastorage-repository.service';

@NgModule({
  imports: [
    CommonModule,
    WebModule,
    routing
  ],
  providers: [
    appRoutingProviders,
    // { provide: DATA_STORAGE_REPOSITORY, useClass: ElectronDataStorageRepositoryService },
    { provide: LogService, useClass: ElectronLogService },
    { provide: ErrorHandler, useClass: ElectronErrorHandlerService },
    UhkHidApiService,
    {
      provide: UhkDeviceService,
      useFactory: uhkDeviceFactory,
      deps: [LogService]
    }
  ],
  bootstrap: [MainAppComponent]
})
export class UhkRendererModule {
}
