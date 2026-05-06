export class IpcCommonRenderer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send(channel: string, ...args: any[]): void {

    }

    on(channel: string, listener: Function): this {
        return this;
    }
}
