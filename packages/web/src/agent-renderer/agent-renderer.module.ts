import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebModule } from '../app/web.module';
import { MainAppComponent } from '../app/app.component';
import { appRoutingProviders, routing } from './agent-renderer.routes';
import { MissingDeviceComponent } from './components/missing-device/missing-device.component';
import { PrivilegeCheckerComponent } from './components/privilege-checker/privilege-checker.component';
import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceInitializedGuard } from './services/uhk-device-initialized.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';
import { DATA_STORAGE_REPOSITORY } from '../app/services/datastorage-repository.service';
import { ElectronDataStorageRepositoryService } from './services/electron-datastorage-repository.service';
import { LogService } from '../../../uhk-common/src/services/logger.service';
import { ElectronLogService } from './services/electron-log.service';
import { ElectronErrorHandlerService } from './services/electron-error-handler.service';
import { AppUpdateRendererService } from './services/app-update-renderer.service';
import { UhkHidApiService } from './services/uhk-hid-api.service';
import { UhkLibUsbApiService } from './services/uhk-lib-usb-api.service';
import { uhkDeviceFactory } from './services/uhk-device-provider';
import { AppRendererService } from './services/app-renderer.service';
import { UhkDeviceService } from './services/uhk-device.service';

@NgModule({
    imports: [
        CommonModule,
        WebModule,
        routing
    ],
    declarations: [
        MissingDeviceComponent,
        PrivilegeCheckerComponent
    ],
    providers: [
        UhkDeviceConnectedGuard,
        UhkDeviceDisconnectedGuard,
        UhkDeviceInitializedGuard,
        UhkDeviceUninitializedGuard,
        appRoutingProviders,
        { provide: DATA_STORAGE_REPOSITORY, useClass: ElectronDataStorageRepositoryService },
        { provide: LogService, useClass: ElectronLogService },
        { provide: ErrorHandler, useClass: ElectronErrorHandlerService },
        AppUpdateRendererService,
        UhkHidApiService,
        UhkLibUsbApiService,
        {
            provide: UhkDeviceService,
            useFactory: uhkDeviceFactory,
            deps: [LogService]
        },
        AppRendererService
    ],
    bootstrap: [MainAppComponent]
})
export class AgentRendererModule {
}
