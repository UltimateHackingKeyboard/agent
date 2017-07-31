import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierModule } from 'angular-notifier';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';
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
import { DATA_STORAGE_REPOSITORY } from './services/datastorage-repository.service';
import { LocalDataStorageRepositoryService } from './services/local-datastorage-repository.service';
import { DefaultUserConfigurationService } from './services/default-user-configuration.service';
import { reducer } from './store/reducers/index';
import { LogService } from './services/logger.service';
import { AutoUpdateSettings } from './components/auto-update-settings/auto-update-settings';
import { angularNotifierConfig } from './models/angular-notifier-config';
import { UndoableNotifierComponent } from './components/undoable-notifier';
import { UhkHeader } from './components/uhk-header/uhk-header';

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
        UhkHeader
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        DragulaModule,
        routing,
        StoreModule.provideStore(reducer),
        RouterStoreModule.connectRouter(),
        // StoreDevtoolsModule.instrumentStore({
        //     monitor: useLogMonitor({
        //         visible: false,
        //         position: 'right'
        //     })
        // }),
        // StoreLogMonitorModule,
        Select2Module,
        NotifierModule.withConfig(angularNotifierConfig),
        EffectsModule.runAfterBootstrap(KeymapEffects),
        EffectsModule.runAfterBootstrap(MacroEffects),
        EffectsModule.runAfterBootstrap(UserConfigEffects),
        EffectsModule.runAfterBootstrap(AutoUpdateSettingsEffects),
        EffectsModule.runAfterBootstrap(ApplicationEffects)
    ],
    providers: [
        SvgModuleProviderService,
        MapperService,
        appRoutingProviders,
        KeymapEditGuard,
        MacroNotFoundGuard,
        CaptureService,
        { provide: DATA_STORAGE_REPOSITORY, useClass: LocalDataStorageRepositoryService },
        DefaultUserConfigurationService,
        LogService,
        DefaultUserConfigurationService
    ],
    bootstrap: [MainAppComponent]
})
export class AppModule {
}
