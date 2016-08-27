import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { APP_ROUTER_PROVIDERS } from './main-app.routes';

import { DataProviderService } from './services/data-provider.service';
import { MapperService } from './services/mapper.service';

import { MainAppComponent }  from './main-app.component';
import { KeymapComponent } from './components/keymap';
import { MacroComponent } from './components/macro';
import { LegacyLoaderComponent } from './components/legacy-loader';
import { NotificationComponent } from './components/notification';
import { SvgKeystrokeKeyComponent, SvgOneLineTextKeyComponent, SvgTwoLineTextKeyComponent } from './components/svg/keys';
import {SvgKeyboardWrapComponent} from './components/svg/wrap/svg-keyboard-wrap.component';
import {LayersComponent} from './components/layers/layers.component';
import {SvgKeyboardComponent} from './components/svg/keyboard/svg-keyboard.component';
import {PopoverComponent} from './components/popover/popover.component';

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
        SvgKeyboardComponent
    ],
    imports: [BrowserModule],
    providers: [
        DataProviderService,
        MapperService,
        APP_ROUTER_PROVIDERS,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [MainAppComponent]
})
export class AppModule { }
