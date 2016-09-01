import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { Select2Component } from 'ng2-select2/ng2-select2';

import { DataProviderService } from './services/data-provider.service';
import { MapperService } from './services/mapper.service';
import {UhkConfigurationService} from './services/uhk-configuration.service';

import { MainAppComponent, appRoutingProviders, routing }  from './main-app';
import { KeymapComponent } from './components/keymap';
import { 
    MacroComponent, 
    MacroItemComponent, 
    MacroActionEditorComponent,
    MacroDelayTabComponent,
    MacroKeyTabComponent,
    MacroMouseTabComponent,
    MacroTextTabComponent
} from './components/macro';
import { LegacyLoaderComponent } from './components/legacy-loader';
import { NotificationComponent } from './components/notification';
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
import { SvgKeyboardWrapComponent } from './components/svg/wrap';
import { LayersComponent } from './components/layers';
import { SvgKeyboardComponent } from './components/svg/keyboard';
import { SvgModuleComponent } from './components/svg/module';
import { PopoverComponent } from './components/popover';
import { KeymapAddComponent } from './components/keymap';
import { SideMenuComponent } from './components/side-menu';
import {
    KeypressTabComponent,
    KeymapTabComponent,
    LayerTabComponent,
    MacroTabComponent,
    MouseTabComponent,
    NoneTabComponent
} from './components/popover/tab';
import { CaptureKeystrokeButtonComponent } from './components/popover/widgets/capture-keystroke';
import { IconComponent } from './components/popover/widgets/icon';
import { ContenteditableModel } from './components/contenteditable';
import {Dragula} from 'ng2-dragula/ng2-dragula';

@NgModule({
    declarations: [
        Select2Component,
        MainAppComponent,
        KeymapComponent,
        MacroComponent,
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
        MacroItemComponent, 
        MacroActionEditorComponent,
        MacroDelayTabComponent,
        MacroKeyTabComponent,
        MacroMouseTabComponent,
        MacroTextTabComponent,
        ContenteditableModel,
        Dragula
    ],
    imports: [
        BrowserModule,
        FormsModule,
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
