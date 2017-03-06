import { NgModule, ReflectiveInjector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { Select2Module } from 'ng2-select2/ng2-select2';

import { MissingDeviceComponent } from './components/missing-device/missing-device.component';
import { PrivilegeCheckerComponent } from './components/privilege-checker';
import { UhkMessageComponent } from './components/uhk-message';
import { AddOnComponent } from './shared/components/add-on';
import { KeyboardSliderComponent } from './shared/components/keyboard/slider';
import { KeymapAddComponent, KeymapHeaderComponent } from './shared/components/keymap';
import { KeymapEditComponent } from './components/keymap/edit';
import { LayersComponent } from './shared/components/layers';
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
} from './shared/components/macro';
import { NotificationComponent } from './shared/components/notification';
import { PopoverComponent } from './shared/components/popover';
import {
    KeymapTabComponent,
    KeypressTabComponent,
    LayerTabComponent,
    MacroTabComponent,
    MouseTabComponent,
    NoneTabComponent
} from './shared/components/popover/tab';
import { CaptureKeystrokeButtonComponent } from './shared/components/popover/widgets/capture-keystroke';
import { IconComponent } from './shared/components/popover/widgets/icon';
import { SettingsComponent } from './shared/components/settings';
import { SideMenuComponent } from './shared/components/side-menu';
import { SvgKeyboardComponent } from './shared/components/svg/keyboard';
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
} from './shared/components/svg/keys';
import { SvgModuleComponent } from './shared/components/svg/module';
import { SvgKeyboardWrapComponent } from './shared/components/svg/wrap';
import { appRoutingProviders, routing } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { MainAppComponent } from './main-app';

import { CancelableDirective } from './shared/directives';

import { CaptureService } from './shared/services/capture.service';
import { MapperService } from './shared/services/mapper.service';
import { UhkDeviceService } from './services/uhk-device.service';

import { KeymapEffects, MacroEffects } from './shared/store/effects';
import { userConfigurationReducer, presetReducer } from './shared/store/reducers';
import { DataStorage } from './shared/store/storage';

import { KeymapEditGuard } from './shared/components/keymap/edit';
import { MacroNotFoundGuard } from './shared/components/macro/not-found';

import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceInitializedGuard } from './services/uhk-device-initialized.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';

// Create DataStorage dependency injection
const storageProvider = ReflectiveInjector.resolve([DataStorage]);
const storageInjector = ReflectiveInjector.fromResolvedProviders(storageProvider);
const storageService: DataStorage = storageInjector.get(DataStorage);

// All reducers that are used in application
const storeConfig = {
    userConfiguration: storageService.saveState(userConfigurationReducer),
    presetKeymaps: presetReducer
};

@NgModule({
    declarations: [
        AppComponent,
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
        MissingDeviceComponent,
        PrivilegeCheckerComponent,
        UhkMessageComponent,
        CancelableDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        DragulaModule,
        routing,
        StoreModule.provideStore(storeConfig, storageService.initialState()),
        StoreDevtoolsModule.instrumentStore({
            monitor: useLogMonitor({
                visible: false,
                position: 'right'
            })
        }),
        StoreLogMonitorModule,
        Select2Module,
        EffectsModule.runAfterBootstrap(KeymapEffects),
        EffectsModule.runAfterBootstrap(MacroEffects)
    ],
    providers: [
        UhkDeviceConnectedGuard,
        UhkDeviceDisconnectedGuard,
        UhkDeviceInitializedGuard,
        UhkDeviceUninitializedGuard,
        MapperService,
        appRoutingProviders,
        KeymapEditGuard,
        MacroNotFoundGuard,
        CaptureService,
        UhkDeviceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
