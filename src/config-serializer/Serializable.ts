/// <references path="Function.d.ts">

import { UhkBuffer } from './UhkBuffer';

export abstract class Serializable<T> {

    private static depth = 0;
    private static maxDisplayedJsonLength = 160;
    private static enableDump = false;

    toJsonObject(): any {
        this.dump(`${this.getIndentation()}${this.constructor.name}.toJsObject: ${this}\n`);
        Serializable.depth++;
        let value = this._toJsonObject();
        Serializable.depth--;
        this.dump(`${this.getIndentation()}=> ${this.stringifyJsonObject(value)}\n`);
        return value;
    }

    // TODO: remove parameter and return the buffer
    toBinary(buffer: UhkBuffer): void {
        this.dump(`\n${this.getIndentation()}${this.constructor.name}.toBinary: ${this} [`);
        Serializable.depth++;
        buffer.enableDump = Serializable.enableDump;
        let value = this._toBinary(buffer);
        buffer.enableDump = false;
        Serializable.depth--;
        this.dump(`]`);
        return value;
    }

    abstract _toJsonObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;

    private dump(value: any) {
        if (Serializable.enableDump) {
            process.stdout.write(value);
        }
    }

    private getIndentation() {
        return new Array(Serializable.depth + 1).join('    ');
    }

    private stringifyJsonObject(jsonObject: any): string {
        let json = JSON.stringify(jsonObject);
        return json.length > Serializable.maxDisplayedJsonLength
            ? json.substr(0, Serializable.maxDisplayedJsonLength) + '...'
            : json;
    }
}
