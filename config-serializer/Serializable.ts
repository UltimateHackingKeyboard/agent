interface Function {
    name: string;
}

abstract class Serializable<T> {

    private static depth = 0;

    fromJsObject(jsObject: any): T {
        let indentation = new Array(Serializable.depth + 1).join('    ');
        let isArray = this instanceof UhkArray;
        process.stdout.write(`${indentation}${this.constructor.name}.fromJsObject: ${JSON.stringify(jsObject)}` + (isArray ? '\n' : ` => `));
        Serializable.depth++;
        let value = this._fromJsObject(jsObject);
        Serializable.depth--;
        if (!isArray) {
            process.stdout.write(`${value}\n`);
        }
        return value;
    }

    fromBinary(buffer: UhkBuffer): T {
        let indentation = new Array(Serializable.depth + 1).join('    ');
        let isArray = this instanceof UhkArray;
        process.stdout.write(`${indentation}${this.constructor.name}.fromBinary: [`);
        if (isArray) {
            process.stdout.write('\n');
        }
        Serializable.depth++;
        buffer.enableDump = !isArray;
        let value = this._fromBinary(buffer);
        buffer.enableDump = false;
        Serializable.depth--;
        if (!isArray) {
            process.stdout.write(`] => ${value}\n`);
        }
        return value;
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
