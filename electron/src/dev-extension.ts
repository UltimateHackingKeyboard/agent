/*
 * Install DevTool extensions when Electron is in development mode
 */
import { app } from 'electron';
import { isDev } from './shared/util/index';

if (isDev()) {

    app.once('ready', () => {
        const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

        installExtension(REDUX_DEVTOOLS)
            .then((name: string) => console.log(`Added Extension:  ${name}`))
            .catch((err: any) => console.log('An error occurred: ', err));

        require('electron-debug')({ showDevTools: true });
    });

}
