import { configure } from 'electron-settings';

export default function setElectronSettingsConfig() {
    configure({
        fileName: 'Settings'
    });
}
