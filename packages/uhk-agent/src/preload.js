const { ipcRenderer } =  require('electron')

ipcRenderer
    .invoke('app-get-config', 'application-settings')
    .then(appSettings => {
        const { appTheme = 'system' } = JSON.parse(appSettings || '{}');
        window.UHK_THEME = appTheme;
    })
