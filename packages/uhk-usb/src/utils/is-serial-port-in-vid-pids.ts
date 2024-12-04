import { PortInfo } from '@serialport/bindings-interface';
import { VidPidPair } from 'uhk-common';

export function isSerialPortInVidPids(serialDevice: PortInfo, vidPids: VidPidPair[]): boolean {
    return vidPids.some(vidPid => {
        return vidPid.vid === Number.parseInt(serialDevice.vendorId, 16)
            && vidPid.pid == Number.parseInt(serialDevice.productId, 16);
    });
}
