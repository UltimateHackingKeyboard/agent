export class IpcCommonRenderer {
    send(channel: string, ...args: any[]): void {}

    on(channel: string, listener: Function): this {
        return this;
    }
}
