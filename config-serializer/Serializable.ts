interface Function {
    name: string;
}

abstract class Serializable<T> {

    private static depth = 0;
    private static maxDisplayedJsonLength = 160;
    private static enableDump = true;

    fromJsObject(jsObject: any): Serializable<T> {
        let isArray = this instanceof ClassArray;
        this.dumpMethodName('fromJsObject');
        this.dump(`${this.strintifyJsObject(jsObject)}` + (isArray ? '\n' : ` => `));
        Serializable.depth++;
        let value = this._fromJsObject(jsObject);
        Serializable.depth--;
        if (!isArray) {
            this.dump(`${value}\n`);
        }
        return value;
    }

    fromBinary(buffer: UhkBuffer): Serializable<T> {
        let isArray = this instanceof ClassArray;
        this.dumpMethodName('fromBinary');
        this.dump('[');
        Serializable.depth++;
        buffer.enableDump = Serializable.enableDump;
        let value = this._fromBinary(buffer);
        buffer.enableDump = false;
        Serializable.depth--;
        if (!isArray) {
            this.dump(`] => ${value}\n`);
        }
        return value;
    }

    toJsObject(): any {
        let isArray = this instanceof ClassArray;
        this.dumpMethodName('toJsObject');
        this.dump(`${this}` + (isArray ? '\n' : ` => `));
        Serializable.depth++;
        let value = this._toJsObject();
        Serializable.depth--;
        if (!isArray) {
            this.dump(`${this.strintifyJsObject(value)}\n`);
        }
        return value;
    }

    toBinary(buffer: UhkBuffer): void {
        let isArray = this instanceof ClassArray;
        this.dumpMethodName('toBinary');
        this.dump(`${this} => ['`);
        Serializable.depth++;
        buffer.enableDump = Serializable.enableDump;
        let value = this._toBinary(buffer);
        buffer.enableDump = false;
        Serializable.depth--;
        if (!isArray) {
            this.dump(`]\n`);
        }
        return value;
    }

    abstract _fromJsObject(jsObject: any): Serializable<T>;
    abstract _fromBinary(buffer: UhkBuffer): Serializable<T>;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;

    private dump(value) {
        if (Serializable.enableDump) {
            process.stdout.write(value);
        }
    }

    private dumpMethodName(methodName: string) {
        let indentation = new Array(Serializable.depth + 1).join('    ');
        this.dump(`${indentation}${this.constructor.name}.${methodName}: `);
    }

    private strintifyJsObject(jsObject: any): string {
        let json = JSON.stringify(jsObject);
        return json.length > Serializable.maxDisplayedJsonLength
            ? json.substr(0, Serializable.maxDisplayedJsonLength) + '...'
            : json;
    }
}
