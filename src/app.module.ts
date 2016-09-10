import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { Select2Component } from 'ng2-select2/ng2-select2';

import { ContenteditableDirective } from './directives/contenteditable';

import { KeymapAddComponent, KeymapComponent } from './components/keymap';
import { LayersComponent } from './components/layers';
import { LegacyLoaderComponent } from './components/legacy-loader';
import {
    MacroActionEditorComponent,
    MacroComponent,
    MacroDelayTabComponent,
    MacroItemComponent,
    MacroKeyTabComponent,
    MacroMouseTabComponent,
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
import { SideMenuComponent } from './components/side-menu';
import { SvgKeyboardComponent } from './components/svg/keyboard';
import {
    SvgIconTextKeyComponent,
    SvgKeyboardKeyComponent,
    SvgKeystrokeKeyComponent,
    SvgOneLineTextKeyComponent,
    SvgSingleIconKeyComponent,
    SvgSwitchKeymapKeyComponent,
    SvgTextIconKeyComponent,
    SvgTwoLineTextKeyComponent
} from './components/svg/keys';
import { SvgModuleComponent } from './components/svg/module';
import { SvgKeyboardWrapComponent } from './components/svg/wrap';
import { MainAppComponent, appRoutingProviders, routing }  from './main-app';

import { DataProviderService } from './services/data-provider.service';
import { MapperService } from './services/mapper.service';
import { UhkConfigurationService } from './services/uhk-configuration.service';

@NgModule({
    declarations: [
        Select2Component,
        MainAppComponent,
        KeymapComponent,
        LegacyLoaderComponent,
        NotificationComponent,
        SvgIconTextKeyComponent,
        SvgKeyboardKeyComponent,
        SvgKeystrokeKeyComponent,
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
        MacroComponent,
        MacroItemComponent,
        MacroActionEditorComponent,
        MacroDelayTabComponent,
        MacroKeyTabComponent,
        MacroMouseTabComponent,
        MacroTextTabComponent,
        ContenteditableDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        DragulaModule,
        routing
    ],
    providers: [
        DataProviderService,
        UhkConfigurationService,
        MapperService,
        appRoutingProviders
    ],
    bootstrap: [MainAppComponent]
})
export class AppModule { }
