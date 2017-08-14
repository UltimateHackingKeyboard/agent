import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierModule } from 'angular-notifier';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStoreModule } from '@ngrx/router-store';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { Select2Module } from 'ng2-select2/ng2-select2';

import { MainAppComponent } from './app.component';
import { AddOnComponent } from './components/add-on';
import { KeyboardSliderComponent } from './components/keyboard/slider';
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
import { SettingsComponent } from './components/settings';
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

import {
    ApplicationEffects,
    AutoUpdateSettingsEffects,
    KeymapEffects,
    MacroEffects,
    UserConfigEffects
} from './store/effects';

import { KeymapEditGuard } from './components/keymap/edit';
import { MacroNotFoundGuard } from './components/macro/not-found';
import { DataStorageRepositoryService } from './services/datastorage-repository.service';
import { DefaultUserConfigurationService } from './services/default-user-configuration.service';
import { reducer } from './store';
import { LogService } from 'uhk-common';
import { AutoUpdateSettings } from './components/auto-update-settings/auto-update-settings';
import { angularNotifierConfig } from './models/angular-notifier-config';
import { UndoableNotifierComponent } from './components/undoable-notifier';
import { UhkHeader } from './components/uhk-header/uhk-header';
import { UpdateAvailableComponent } from './components/update-available/update-available.component';
import { UhkMessageComponent } from './components/uhk-message/uhk-message.component';
import { AppRendererService } from './services/app-renderer.service';
import { AppUpdateRendererService } from './services/app-update-renderer.service';
import { IpcCommonRenderer } from './services/ipc-common-renderer';
import { MissingDeviceComponent } from './components/missing-device/missing-device.component';
import { PrivilegeCheckerComponent } from './components/privilege-checker/privilege-checker.component';
import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';
import { MainPage } from './pages/main-page/main.page';
import { DeviceEffects } from './store/effects/device';
import { DeviceRendererService } from './services/device-renderer.service';
import { UhkDeviceInitializedGuard } from './services/uhk-device-initialized.guard';

@NgModule({
    declarations: [
        MainAppComponent,
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
        MainPage
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        DragulaModule,
        routing,
        Select2Module,
        StoreModule.provideStore(reducer),
        RouterStoreModule.connectRouter(),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        NotifierModule.withConfig(angularNotifierConfig),
        EffectsModule.runAfterBootstrap(KeymapEffects),
        EffectsModule.runAfterBootstrap(MacroEffects),
        EffectsModule.runAfterBootstrap(UserConfigEffects),
        EffectsModule.run(AutoUpdateSettingsEffects),
        EffectsModule.run(ApplicationEffects),
        EffectsModule.run(DeviceEffects)
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
        DefaultUserConfigurationService,
        AppUpdateRendererService,
        AppRendererService,
        IpcCommonRenderer,
        DeviceRendererService,
        UhkDeviceConnectedGuard,
        UhkDeviceDisconnectedGuard,
        UhkDeviceInitializedGuard,
        UhkDeviceUninitializedGuard
    ],
    exports: [
        UhkMessageComponent
    ],
    bootstrap: [MainAppComponent]
})
export class WebModule {
}
