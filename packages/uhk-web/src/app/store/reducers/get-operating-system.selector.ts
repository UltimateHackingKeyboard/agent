import { OperatingSystem } from '../../models/operating-system';
import { State } from './app.reducer';

export const getOperatingSystem = (state: State): OperatingSystem => {
    if (state.runningInElectron) {
        switch (state.platform) {
            case 'darwin':
                return OperatingSystem.Mac;

            case 'win32':
                return OperatingSystem.Windows;

            default:
                return OperatingSystem.Linux;
        }
    }

    const platform = navigator.platform.toLowerCase();

    if (platform.indexOf('mac') > -1) {
        return OperatingSystem.Mac;
    }

    if (platform.indexOf('win') > -1) {
        return OperatingSystem.Windows;
    }

    return OperatingSystem.Linux;
};
