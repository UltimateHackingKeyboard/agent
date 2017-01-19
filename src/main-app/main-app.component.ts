import { Component, ViewEncapsulation, HostListener } from '@angular/core';

// import { Observable } from 'rxjs/Observable';

// import { Store } from '@ngrx/store';
// import { AppState } from '../store';
// import { DataStorage } from '../store/storage';
// import { getKeymapEntities, getMacroEntities } from '../store/reducers';

// import { UhkBuffer } from '../config-serializer/UhkBuffer';
// import { UserConfiguration } from '../config-serializer/config-items/UserConfiguration';

// import { UhkDeviceService } from '../services/uhk-device.service';

@Component({
    selector: 'main-app',
    template: require('./main-app.component.html'),
    styles: [require('./main-app.component.scss')],
    encapsulation: ViewEncapsulation.None
})
export class MainAppComponent {

    // private configuration$: Observable<UserConfiguration>;

    constructor(
        // private uhkDevice: UhkDeviceService,
        // store: Store<AppState>,
        // dataStorage: DataStorage
    ) {
        // this.configuration$ = store.let(getKeymapEntities())
        //     .combineLatest(store.let(getMacroEntities()))
        //     .map((pair) => {
        //         const config = new UserConfiguration();
        //         Object.assign(config, dataStorage.getConfiguration());
        //         config.keymaps = pair[0];
        //         config.macros = pair[1];
        //         return config;
        //     });
    }

    @HostListener('window:keydown.control.o', ['$event'])
    onCtrlO(event: KeyboardEvent): void {
        console.log('ctrl + o pressed');
        event.preventDefault();
        event.stopPropagation();
        this.sendConfiguration();
    }

    private sendConfiguration(): void {
        // this.configuration$
        //     .first()
        //     .map(configuration => {
        //         const uhkBuffer = new UhkBuffer();
        //         configuration.toBinary(uhkBuffer);
        //         return uhkBuffer.getBufferContent();
        //     })
        //     .switchMap((buffer: Buffer) => this.uhkDevice.sendConfig(buffer))
        //     .do(response => console.log('Sending config finished', response))
        //     .switchMap(() => this.uhkDevice.applyConfig())
        //     .subscribe(
        //     (response) => console.log('Applying config finished', response),
        //     error => console.error('Error during uploading config', error),
        //     () => console.log('Config has been sucessfully uploaded')
        //     );
    }

}
