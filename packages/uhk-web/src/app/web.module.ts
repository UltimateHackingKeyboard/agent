import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from './shared.module';
import { MainAppComponent } from './app.component';
import { reducers } from './store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { effects } from './store/effects';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        StoreModule.forRoot(reducers),
        StoreRouterConnectingModule,
        StoreDevtoolsModule.instrument({
            maxAge: 10
        }),
        EffectsModule.forRoot(effects)
    ],
    bootstrap: [MainAppComponent]
})
export class WebModule {
}
