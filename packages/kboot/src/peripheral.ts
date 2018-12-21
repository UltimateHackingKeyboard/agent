import { CommandOption, CommandResponse, DataOption } from './models';

export interface Peripheral {
    open(): void;

    close(): void;

    sendCommand(options: CommandOption): Promise<CommandResponse>;

    writeMemory(data: DataOption): Promise<void>;

    readMemory(startAddress: number, count: number): Promise<Buffer>;
}
