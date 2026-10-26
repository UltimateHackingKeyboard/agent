import { PortInfo } from '@serialport/bindings-interface';
import { Peripheral, SerialPeripheral } from '@uhk/mcumgr';
import { SerialPort } from 'serialport';
import { LogService, VidPidPair } from 'uhk-common';

import { isSerialPortInVidPids } from './is-serial-port-in-vid-pids.js';
import { snooze } from './snooze.js';

export interface OpenMcuBootloaderPeripheralOptions {
    /**
     * Vendor id and product id pairs that the bootloader could be enumerated with.
     */
    bootloaderVidPids: VidPidPair[];
    logService: LogService;
    /**
     * Total time in millisecond to wait for the serial port to be openable.
     */
    timeout: number;
    /**
     * Time in millisecond to wait between the open attempts.
     */
    retryDelay?: number;
    /**
     * Serial port lister. It can be replaced in tests.
     */
    listSerialPorts?: () => Promise<PortInfo[]>;
    /**
     * Peripheral factory. It can be replaced in tests.
     */
    createPeripheral?: (path: string) => Peripheral;
}

/**
 * Wait until the bootloader serial port appears and it can be opened.
 *
 * The operating system needs some time to initialise the serial peripheral after the reenumeration.
 * Instead of hoping that a hard coded wait time is enough, keep trying until the timeout expires.
 * The port is re-resolved from the operating system on every attempt because the device needs to
 * reinstall its driver when it appears first time and the port path may change too.
 */
export async function openMcuBootloaderPeripheral(options: OpenMcuBootloaderPeripheralOptions): Promise<Peripheral> {
    const {
        bootloaderVidPids,
        logService,
        timeout,
        retryDelay = 250,
        listSerialPorts = () => SerialPort.list(),
        createPeripheral = (path: string) => new SerialPeripheral(path),
    } = options;

    const startTime = new Date().getTime();
    let attempt = 0;
    let lastError: Error;

    while (true) {
        attempt++;

        const bootloaderPort = (await listSerialPorts())
            .find(port => isSerialPortInVidPids(port, bootloaderVidPids));

        if (!bootloaderPort) {
            logService.misc(`[UhkOperations] MCU bootloader serial port is not available yet (attempt: ${attempt})`);
        }
        else {
            const peripheral = createPeripheral(bootloaderPort.path);

            try {
                await peripheral.open();
                logService.misc(`[UhkOperations] MCU bootloader serial port opened: ${bootloaderPort.path} (attempt: ${attempt}, elapsed: ${new Date().getTime() - startTime}ms)`);

                return peripheral;
            }
            catch (error) {
                lastError = error as Error;
                logService.misc(`[UhkOperations] Could not open the "${bootloaderPort.path}" MCU bootloader serial port (attempt: ${attempt}): ${lastError.message}`);
                try {
                    await peripheral.close();
                }
                catch {
                    // the port could not be opened so there is nothing to close
                }
            }
        }

        if (new Date().getTime() - startTime >= timeout) {
            break;
        }

        await snooze(retryDelay);
    }

    const message = lastError
        ? `Could not open the MCU bootloader serial port within ${timeout}ms. Last error: ${lastError.message}`
        : `The MCU bootloader serial port did not appear within ${timeout}ms`;
    logService.error(`[UhkOperations] ${message}`);

    throw new Error(message);
}
