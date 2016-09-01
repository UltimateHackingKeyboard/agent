import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { DataProviderService } from './services/data-provider.service';
import { MapperService } from './services/mapper.service';

import { MainAppComponent, APP_ROUTER_PROVIDERS }  from './main-app';
import { KeymapComponent } from './components/keymap';
import { MacroComponent } from './components/macro';
import { LegacyLoaderComponent } from './components/legacy-loader';
import { NotificationComponent } from './components/notification';
import {
    SvgKeystrokeKeyComponent, SvgOneLineTextKeyComponent, SvgTwoLineTextKeyComponent
} from './components/svg/keys';
import { SvgKeyboardWrapComponent } from './components/svg/wrap';
import { LayersComponent } from './components/layers';
import { SvgKeyboardComponent } from './components/svg/keyboard';
import { PopoverComponent } from './components/popover';
import { KeymapAddComponent } from './components/keymap';
import {UhkConfigurationService} from './services/uhk-configuration.service';

@NgModule({
    declarations: [
        MainAppComponent,
        KeymapComponent,
        MacroComponent,
        LegacyLoaderComponent,
        NotificationComponent,
        SvgKeystrokeKeyComponent,
        SvgOneLineTextKeyComponent,
        SvgTwoLineTextKeyComponent,
        SvgKeyboardWrapComponent,
        LayersComponent,
        PopoverComponent,
        SvgKeyboardComponent,
        KeymapAddComponent
    ],
    imports: [BrowserModule],
    providers: [
        DataProviderService,
        UhkConfigurationService,
        MapperService,
        APP_ROUTER_PROVIDERS,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [MainAppComponent]
})
export class AppModule { }
