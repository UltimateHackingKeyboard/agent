import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularSplitModule } from 'angular-split';
import { DragulaModule } from 'ng2-dragula';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgSelectModule } from '@ng-select/ng-select';
import { NouisliderModule } from 'ng2-nouislider';
import { ClipboardModule } from 'ngx-clipboard';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

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
import {
    KeymapAddComponent,
    KeymapAddEmptyComponent,
    KeymapEditComponent,
    KeymapHeaderComponent,
    KeymapAddSecondaryMenuComponent
} from './components/keymap';
import { LayerOptionComponent, LayersComponent } from './components/layers';
import {
    MacroActionEditorComponent,
    MacroCommandComponent,
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
import { AboutComponent, SettingsComponent, ContributorBadgeComponent } from './components/agent';
import { SecondSideMenuContainerComponent, SideMenuComponent } from './components/side-menu';
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
    SvgSecondaryRoleComponent,
    SvgSingleIconKeyComponent,
    SvgSwitchKeymapKeyComponent,
    SvgTextIconKeyComponent,
    SvgTwoLineTextKeyComponent
} from './components/svg/keys';
import { SvgModuleComponent } from './components/svg/module';
import { SvgKeyboardWrapComponent } from './components/svg/wrap';
import { appRoutingProviders, routing } from './app.routes';

import { CancelableDirective, ExternalUrlDirective } from './directives';
import { SafeStylePipe, SafeUrlPipe, UserConfigHistoryDisplayTextPipe } from './pipes';

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
import { LinuxPrivilegeCheckerComponent } from './components/linux-privilege-checker';
import { MacPrivilegeCheckerComponent } from './components/mac-privilege-checker';
import { PrivilegeCheckerComponent } from './components/privilege-checker';
import { UhkDeviceConnectedGuard } from './services/uhk-device-connected.guard';
import { UhkDeviceDisconnectedGuard } from './services/uhk-device-disconnected.guard';
import { UhkDeviceUninitializedGuard } from './services/uhk-device-uninitialized.guard';
import { UhkMultiDeviceGuard } from './services/uhk-multi-device.guard';
import { MainPage } from './pages/main-page/main.page';
import { DeviceRendererService } from './services/device-renderer.service';
import { UhkDeviceInitializedGuard } from './services/uhk-device-initialized.guard';
import { ProgressButtonComponent } from './components/progress-button/progress-button.component';
import { MainAppComponent } from './app.component';
import { LoadingDevicePageComponent } from './pages/loading-page/loading-device.page';
import { MultiDevicePageComponent } from './pages/multi-device.page';
import { UpdateAgentPageComponent } from './pages/update-agent.page';
import { UpdateFirmwarePageComponent } from './pages/update-firmware.page';
import { UhkDeviceLoadingGuard } from './services/uhk-device-loading.guard';
import { XtermComponent } from './components/xterm/xterm.component';
import { SliderWrapperComponent } from './components/slider-wrapper/slider-wrapper.component';
import { EditableTextComponent } from './components/editable-text/editable-text.component';
import { Autofocus } from './directives/autofocus/autofocus.directive';
import { UhkDeviceBootloaderNotActiveGuard } from './services/uhk-device-bootloader-not-active.guard';
import { FileUploadComponent } from './components/file-upload';
import { AutoGrowInputComponent } from './components/auto-grow-input';
import { HelpPageComponent } from './components/agent/help-page/help-page.component';
import { UdevRulesComponent } from './components/udev-rules/udev-rules.component';
import { HighlightArrowComponent } from './components/highlight-arrow/highlight-arrow.component';
import { UhkProgressBarComponent } from './components/progressbar/uhk-progress-bar.component';
import { OutOfSpaceWarningComponent } from './components/out-of-space-warning';
import { UserConfigurationHistoryComponent } from './components/user-configuration-history';
import { KeyActionDragAndDropService } from './services/key-action-drag-and-drop.service';
import { FirmwareFileUploadComponent } from './components/device/firmware-file-upload/firmware-file-upload.component';
import { FirmwareUpgradePanelComponent } from './components/device/firmware-upgrade-panel';
import { MacroCommandEditorComponent } from './components/macro/action-editor/tab/command';
import { AgentUpdateNeededGuard } from './services/agent-update-needed-guard.service';
import { SmartMacroDocRendererService } from './services/smart-macro-doc-renderer.service';
import { SmartMacroDocDirective } from './components/macro/directives/smart-macro-doc.directive';
import { SmartMacroDocService } from './services/smart-macro-doc-service';

@NgModule({
    declarations: [
        MainAppComponent,
        DeviceConfigurationComponent,
        DeviceFirmwareComponent,
        FirmwareFileUploadComponent,
        FirmwareUpgradePanelComponent,
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
        LayerOptionComponent,
        LayersComponent,
        PopoverComponent,
        KeymapAddComponent,
        KeymapAddEmptyComponent,
        KeymapAddSecondaryMenuComponent,
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
        MacroCommandComponent,
        MacroCommandEditorComponent,
        MacroDelayTabComponent,
        MacroKeyTabComponent,
        MacroMouseTabComponent,
        MacroTextTabComponent,
        MacroNotFoundComponent,
        AddOnComponent,
        AboutComponent,
        ContributorBadgeComponent,
        SettingsComponent,
        KeyboardSliderComponent,
        CancelableDirective,
        SafeStylePipe,
        SafeUrlPipe,
        AutoUpdateSettings,
        UndoableNotifierComponent,
        UhkHeader,
        UhkProgressBarComponent,
        UpdateAvailableComponent,
        UhkMessageComponent,
        MissingDeviceComponent,
        LinuxPrivilegeCheckerComponent,
        MacPrivilegeCheckerComponent,
        PrivilegeCheckerComponent,
        MainPage,
        ProgressButtonComponent,
        LoadingDevicePageComponent,
        MultiDevicePageComponent,
        UpdateAgentPageComponent,
        UpdateFirmwarePageComponent,
        XtermComponent,
        SliderWrapperComponent,
        EditableTextComponent,
        Autofocus,
        RestoreConfigurationComponent,
        RecoveryModeComponent,
        FileUploadComponent,
        AutoGrowInputComponent,
        HelpPageComponent,
        ExternalUrlDirective,
        SecondSideMenuContainerComponent,
        SvgSecondaryRoleComponent,
        UdevRulesComponent,
        HighlightArrowComponent,
        OutOfSpaceWarningComponent,
        SmartMacroDocDirective,
        UserConfigurationHistoryComponent,
        UserConfigHistoryDisplayTextPipe
    ],
    imports: [
        AngularSplitModule,
        CommonModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        FormsModule,
        DragulaModule.forRoot(),
        routing,
        MonacoEditorModule,
        NgxSelectModule.forRoot({
            keepSelectedItems: true,
            optionValueField: 'id',
            optionTextField: 'text'
        }),
        NgSelectModule,
        NouisliderModule,
        NotifierModule.withConfig(angularNotifierConfig),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
        }),
        ClipboardModule,
        ContextMenuModule.forRoot({
            useBootstrap4: true
        }),
        HttpClientModule,
        NgbTooltipModule,
        NgbDropdownModule
    ],
    providers: [
        SvgModuleProviderService,
        KeyActionDragAndDropService,
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
        SmartMacroDocRendererService,
        SmartMacroDocService,
        UhkDeviceConnectedGuard,
        UhkDeviceDisconnectedGuard,
        UhkDeviceInitializedGuard,
        UhkDeviceUninitializedGuard,
        UhkDeviceLoadingGuard,
        UhkDeviceBootloaderNotActiveGuard,
        UhkMultiDeviceGuard,
        AgentUpdateNeededGuard
    ],
    exports: [
        UhkMessageComponent,
        MainAppComponent
    ]
})
export class SharedModule {
}
