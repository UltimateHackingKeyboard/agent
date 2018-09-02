import { OperationSystem } from '../../models/operation-system';
import { State } from './app.reducer';

export const getOperationSystem = (state: State): OperationSystem => {
    if (state.runningInElectron) {
        switch (state.platform) {
            case 'darwin':
                return OperationSystem.Mac;

            case 'win32':
                return OperationSystem.Windows;

            default:
                return OperationSystem.Linux;
        }
    }

    const platform = navigator.platform.toLowerCase();

    if (platform.indexOf('mac') > -1) {
        return OperationSystem.Mac;
    }

    if (platform.indexOf('win') > -1) {
        return OperationSystem.Windows;
    }

    return OperationSystem.Linux;
};
