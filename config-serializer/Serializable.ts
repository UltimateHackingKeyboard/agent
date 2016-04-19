abstract class Serializable<T> {

    private static depth = 0;
    private static maxDisplayedJsonLength = 160;
    private static enableDump = true;

    fromJsObject(jsObject: any): Serializable<T> {
        this.dump(`${this.getIndentation()}${this.constructor.name}.fromJsObject: ` +
                  `${this.strintifyJsObject(jsObject)}\n`);
        Serializable.depth++;
        let value = this._fromJsObject(jsObject);
        Serializable.depth--;
        this.dump(`${this.getIndentation()}=> ${value}\n`);
        return value;
    }

    fromBinary(buffer: UhkBuffer): Serializable<T> {
        this.dump(`\n${this.getIndentation()}${this.constructor.name}.fromBinary: [`);
        Serializable.depth++;
        buffer.enableDump = Serializable.enableDump;
        let value = this._fromBinary(buffer);
        buffer.enableDump = false;
        Serializable.depth--;
        this.dump(`]\n${this.getIndentation()}=> ${value}`);
        return value;
    }

    toJsObject(): any {
        this.dump(`${this.getIndentation()}${this.constructor.name}.toJsObject: ${this}\n`);
        Serializable.depth++;
        let value = this._toJsObject();
        Serializable.depth--;
        this.dump(`${this.getIndentation()}=> ${this.strintifyJsObject(value)}\n`);
        return value;
    }

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

    abstract _fromJsObject(jsObject: any): Serializable<T>;
    abstract _fromBinary(buffer: UhkBuffer): Serializable<T>;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;

    private dump(value) {
        if (Serializable.enableDump) {
            process.stdout.write(value);
        }
    }

    private getIndentation() {
        return new Array(Serializable.depth + 1).join('    ');
    }

    private strintifyJsObject(jsObject: any): string {
        let json = JSON.stringify(jsObject);
        return json.length > Serializable.maxDisplayedJsonLength
            ? json.substr(0, Serializable.maxDisplayedJsonLength) + '...'
            : json;
    }
}
