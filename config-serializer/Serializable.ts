interface Function {
    name: string;
}

abstract class Serializable<T> {

    private static depth = 0;

    fromJsObject(jsObject: any): T {
        let identation = new Array(Serializable.depth + 1).join('    ');
        process.stdout.write(`${identation}* ${this.constructor.name}.fromJsObject(${JSON.stringify(jsObject)}) => `);
        Serializable.depth++;
        let value = this._fromJsObject(jsObject);
        Serializable.depth--;
        process.stdout.write(`${value.toString()}\n`);
        return value;
    }

    fromBinary(buffer: UhkBuffer): T {
        return this._fromBinary(buffer);
    }

    toJsObject(): any {
        return this._toJsObject();
    }

    toBinary(buffer: UhkBuffer): void {
        this._toBinary(buffer);
    }

    abstract _fromJsObject(jsObject: any): T;
    abstract _fromBinary(buffer: UhkBuffer): T;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;
}
