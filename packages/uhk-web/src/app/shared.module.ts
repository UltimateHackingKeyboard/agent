import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierModule } from 'angular-notifier';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { NgxSelectModule } from '@ert78gb/ngx-select-ex';
import { NouisliderModule } from 'ng2-nouislider';
import { ClipboardModule } from 'ngx-clipboard';

import { AddOnComponent } from './components/add-on';
import { KeyboardSliderComponent } from './components/keyboard/slider';
import {
    DeviceConfigurationComponent,
    DeviceFirmwareComponent,
    MouseSpeedComponent,
    LEDBrightnessComponent,
    RestoreConfigurationComponent,
    RecoveryModeComponent
} from './components/device';
import { KeymapAddComponent, KeymapEditComponent, KeymapHeaderComponent } from './components/keymap';
import { LayersComponent } from './components/layers';
import {
    MacroActionEditorComponent,
    MacroDelayTabComponent,
    MacroEditComponent,
    MacroHeaderComponent,
    MacroItemComponent,
    MacroKeyTabComponent,
    MacroListComponent,
    MacroMouseTabComponent,
    MacroNotFoundComponent,
    MacroTextTabComponent
} from './components/macro';
import { NotificationComponent } from './components/notification';
import { PopoverComponent } from './components/popover';
import {
    KeymapTabComponent,
    KeypressTabComponent,
    LayerTabComponent,
    MacroTabComponent,
    MouseTabComponent,
    NoneTabComponent
} from './components/popover/tab';
import { CaptureKeystrokeButtonComponent } from './components/popover/widgets/capture-keystroke';
import { IconComponent } from './components/popover/widgets/icon';
import { AboutComponent, SettingsComponent } from './components/agent';
import { SideMenuComponent } from './components/side-menu';
import { SvgKeyboardComponent } from './components/svg/keyboard';
import {
    SvgIconTextKeyComponent,
    SvgKeyboardKeyComponent,
    SvgKeystrokeKeyComponent,
    SvgMouseClickKeyComponent,
    SvgMouseKeyComponent,
    SvgMouseMoveKeyComponent,
    SvgMouseScrollKeyComponent,
    SvgMouseSpeedKeyComponent,
    SvgOneLineTextKeyComponent,
    SvgSingleIconKeyComponent,
    SvgSwitchKeymapKeyComponent,
    SvgTextIconKeyComponent,
    SvgTwoLineTextKeyComponent
} from './components/svg/keys';
import { SvgModuleComponent } from './components/svg/module';
import { SvgKeyboardWrapComponent } from './components/svg/wrap';
import { appRoutingProviders, routing } from './app.routes';

import { CancelableDirective, TooltipDirective } from './directives';
import { SafeStylePipe } from './pipes';

import { CaptureService } from './services/capture.service';
import { MapperService } from './services/mapper.service';
import { SvgModuleProviderService } from './services/svg-module-provider.service';

import { KeymapEditGuard } from './components/keymap/edit';
import { MacroNotFoundGuard } from './components/macro/not-found';
import { DataStorageRepositoryService } from './services/datastorage-repository.service';
import { DefaultUserConfigurationService } from './services/default-user-configuration.service';
import { LogService } from 'uhk-common';
import { AutoUpdateSettings } from './components/auto-update-settings/auto-update-settings';
import { angularNotifierConfig } from './models/angular-notifier-config';
import { UndoableNotifierComponent } from './components/undoable-notifier';
import { UhkHeader } from './components/uhk-header/uhk-header';
import { UpdateAvailableComponent } from './components/update-available';
import { UhkMessageComponent } from './components/uhk-message';
import { AppRendererService } from './services/app-renderer.service';
import { AppUpdateRendererService } from './services/app-update-renderer.service';
import { IpcCommonRenderer } from './services/ipc-common-renderer';
import { MissingDeviceComponent } from './components/missing-device';
import { PrivilegeCheckerComponent } from './components/privilege-checker';
import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';
import { MainPage } from './pages/main-page/main.page';
import { DeviceRendererService } from './services/device-renderer.service';
import { UhkDeviceInitializedGuard } from './services/uhk-device-initialized.guard';
import { ProgressButtonComponent } from './components/progress-button/progress-button.component';
import { MainAppComponent } from './app.component';
import { LoadingDevicePageComponent } from './pages/loading-page/loading-device.page';
import { UhkDeviceLoadingGuard } from './services/uhk-device-loading.guard';
import { UhkDeviceLoadedGuard } from './services/uhk-device-loaded.guard';
import { XtermComponent } from './components/xterm/xterm.component';
import { SliderWrapperComponent } from './components/slider-wrapper/slider-wrapper.component';
import { EditableTextComponent } from './components/editable-text/editable-text.component';
import { Autofocus } from './directives/autofocus/autofocus.directive';
import { UhkDeviceBootloaderNotActiveGuard } from './services/uhk-device-bootloader-not-active.guard';
import { FileUploadComponent } from './components/file-upload';
import { AutoGrowInputComponent } from './components/auto-grow-input';

@NgModule({
    declarations: [
        MainAppComponent,
        DeviceConfigurationComponent,
        DeviceFirmwareComponent,
        MouseSpeedComponent,
        LEDBrightnessComponent,
        KeymapEditComponent,
        KeymapHeaderComponent,
        NotificationComponent,
        SvgIconTextKeyComponent,
        SvgKeyboardKeyComponent,
        SvgKeystrokeKeyComponent,
        SvgMouseKeyComponent,
        SvgMouseClickKeyComponent,
        SvgMouseMoveKeyComponent,
        SvgMouseScrollKeyComponent,
        SvgMouseSpeedKeyComponent,
        SvgOneLineTextKeyComponent,
        SvgSingleIconKeyComponent,
        SvgSwitchKeymapKeyComponent,
        SvgTextIconKeyComponent,
        SvgTwoLineTextKeyComponent,
        SvgKeyboardKeyComponent,
        SvgKeyboardWrapComponent,
        SvgKeyboardComponent,
        SvgModuleComponent,
        LayersComponent,
        PopoverComponent,
        KeymapAddComponent,
        SideMenuComponent,
        KeypressTabComponent,
        KeymapTabComponent,
        LayerTabComponent,
        MacroTabComponent,
        MouseTabComponent,
        NoneTabComponent,
        CaptureKeystrokeButtonComponent,
        IconComponent,
        MacroEditComponent,
        MacroListComponent,
        MacroHeaderComponent,
        MacroItemComponent,
        MacroActionEditorComponent,
        MacroDelayTabComponent,
        MacroKeyTabComponent,
        MacroMouseTabComponent,
        MacroTextTabComponent,
        MacroNotFoundComponent,
        AddOnComponent,
        AboutComponent,
        SettingsComponent,
        KeyboardSliderComponent,
        CancelableDirective,
        TooltipDirective,
        SafeStylePipe,
        AutoUpdateSettings,
        UndoableNotifierComponent,
        UhkHeader,
        UpdateAvailableComponent,
        UhkMessageComponent,
        MissingDeviceComponent,
        PrivilegeCheckerComponent,
        MainPage,
        ProgressButtonComponent,
        LoadingDevicePageComponent,
        XtermComponent,
        SliderWrapperComponent,
        EditableTextComponent,
        Autofocus,
        RestoreConfigurationComponent,
        RecoveryModeComponent,
        FileUploadComponent,
        AutoGrowInputComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        DragulaModule,
        routing,
        NgxSelectModule,
        NouisliderModule,
        NotifierModule.withConfig(angularNotifierConfig),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
        }),
        ClipboardModule
    ],
    providers: [
        SvgModuleProviderService,
        MapperService,
        appRoutingProviders,
        KeymapEditGuard,
        MacroNotFoundGuard,
        CaptureService,
        DataStorageRepositoryService,
        DefaultUserConfigurationService,
        LogService,
        AppUpdateRendererService,
        AppRendererService,
        IpcCommonRenderer,
        DeviceRendererService,
        UhkDeviceConnectedGuard,
        UhkDeviceDisconnectedGuard,
        UhkDeviceInitializedGuard,
        UhkDeviceUninitializedGuard,
        UhkDeviceLoadingGuard,
        UhkDeviceLoadedGuard,
        UhkDeviceBootloaderNotActiveGuard
    ],
    exports: [
        UhkMessageComponent,
        MainAppComponent
    ]
})
export class SharedModule {
}
