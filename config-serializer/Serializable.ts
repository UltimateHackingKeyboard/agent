interface Function {
    name: string;
}

abstract class Serializable<T> {

    private static depth = 0;
    private static maxDisplayedJsonLength = 160;
    private static enableDump = true;

    strintifyJsObject(jsObject: any): string {
        let json = JSON.stringify(jsObject);
        return json.length > Serializable.maxDisplayedJsonLength
            ? json.substr(0, Serializable.maxDisplayedJsonLength) + '...'
            : json;
    }

    fromJsObject(jsObject: any): Serializable<T> {
        let indentation = new Array(Serializable.depth + 1).join('    ');
        let isArray = this instanceof ClassArray;
        this.dump(`${indentation}${this.constructor.name}.fromJsObject: ${this.strintifyJsObject(jsObject)}` + (isArray ? '\n' : ` => `));
        Serializable.depth++;
        let value = this._fromJsObject(jsObject);
        Serializable.depth--;
        if (!isArray) {
            this.dump(`${value}\n`);
        }
        return value;
    }

    fromBinary(buffer: UhkBuffer): Serializable<T> {
        let indentation = new Array(Serializable.depth + 1).join('    ');
        let isArray = this instanceof ClassArray;
        this.dump(`${indentation}${this.constructor.name}.fromBinary: [`);
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
        let indentation = new Array(Serializable.depth + 1).join('    ');
        let isArray = this instanceof ClassArray;
        this.dump(`${indentation}${this.constructor.name}.toJsObject: ${this}` + (isArray ? '\n' : ` => `));
        Serializable.depth++;
        let value = this._toJsObject();
        Serializable.depth--;
        if (!isArray) {
            this.dump(`${this.strintifyJsObject(value)}\n`);
        }
        return value;
    }

    toBinary(buffer: UhkBuffer): void {
        let indentation = new Array(Serializable.depth + 1).join('    ');
        let isArray = this instanceof ClassArray;
        this.dump(`${indentation}${this.constructor.name}.toBinary: ${this} => ['`);
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

    dump(value) {
        if (Serializable.enableDump) {
            process.stdout.write(value);
        }
    }
}
