import { CommandOption, CommandResponse, DataOption } from './models/index.js';

export interface Peripheral {
    open(): Promise<void>;

    close(): void;

    sendCommand(options: CommandOption): Promise<CommandResponse>;

    writeMemory(data: DataOption): Promise<void>;

    readMemory(startAddress: number, count: number): Promise<Buffer>;
}
