import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from 'uhk-common';
import { ElectronDataStorageRepositoryService } from './services/electron-datastorage-repository.service';
import { ElectronLogService } from './services/electron-log.service';
import { ElectronErrorHandlerService } from './services/electron-error-handler.service';
import { WebModule } from '../app/web.module';
import { routing } from '../app/app.routes';
import { MainAppComponent } from '../app/app.component';
import { IpcUhkRenderer } from './services/ipc-uhk-renderer';
import { IpcCommonRenderer } from '../app/services/ipc-common-renderer';
import { DataStorageRepositoryService } from '../app/services/datastorage-repository.service';

@NgModule({
  imports: [
    CommonModule,
    WebModule,
    routing
  ],
  providers: [
    { provide: DataStorageRepositoryService, useClass: ElectronDataStorageRepositoryService },
    { provide: IpcCommonRenderer, useClass: IpcUhkRenderer },
    { provide: LogService, useClass: ElectronLogService },
    { provide: ErrorHandler, useClass: ElectronErrorHandlerService }
  ],
  bootstrap: [MainAppComponent]
})
export class UhkRendererModule {
}
