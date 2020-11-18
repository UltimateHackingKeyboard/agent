const settings = require('electron-settings');
const { appTheme = 'system' } = JSON.parse(settings.get('application-settings') || '{}');

window.UHK_THEME = appTheme;
