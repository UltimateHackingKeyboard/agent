import { CommandOption, CommandResponse, DataOption, Peripheral, ResponseCodes, ResponseTags } from '../src/index.js';

export class TestPeripheral implements Peripheral {
    close(): void {
    }

    open(): void {
    }

    sendCommand(options: CommandOption): Promise<CommandResponse> {
        const response = {
            tag: ResponseTags.Generic,
            code: ResponseCodes.Success,
            raw: Buffer.alloc(0)
        };

        return Promise.resolve(response);
    }

    writeMemory(data: DataOption): Promise<void> {
        return Promise.resolve();
    }

    readMemory(startAddress: number, count: number): Promise<Buffer> {
        return Promise.resolve(Buffer.alloc(0));
    }
}
