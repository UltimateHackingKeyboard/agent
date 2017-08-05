import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebModule } from '../app/web.module';
import { MainAppComponent } from '../app/app.component';

@NgModule({
    imports: [
        CommonModule,
        WebModule
    ],
    declarations: [

    ],
    bootstrap: [MainAppComponent]
})
export class AgentRendererModule { }
