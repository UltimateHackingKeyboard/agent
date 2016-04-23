import {Serializable} from './Serializable';
import {UhkBuffer} from './UhkBuffer';

export abstract class ClassArray<T extends Serializable<T>> extends Serializable<ClassArray<T>> {

    elements: T[] = [];

    _fromJsObject(jsObjects: any): ClassArray<T> {
        for (let jsObject of jsObjects) {
            this.elements.push(this.jsObjectToClass(jsObject));
        }
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ClassArray<T> {
        let arrayLength = buffer.readCompactLength();

        if (buffer.enableDump) {
            buffer.enableDump = false;
        }

        for (let i = 0; i < arrayLength; i++) {
            this.elements.push(this.binaryToClass(buffer));
        }
        return this;
    }

    _toJsObject(): any {
        let array = [];
        for (let element of this.elements) {
            array.push(element.toJsObject());
        }
        return array;
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeCompactLength(this.elements.length);

        if (buffer.enableDump) {
            buffer.enableDump = false;
        }

        for (let element of this.elements) {
            element.toBinary(buffer);
        }
    }

    toString(): string {
        return `<${this.constructor.name} length="${this.elements.length}">`;
    }

    abstract jsObjectToClass(jsObject: any): T;
    abstract binaryToClass(buffer: UhkBuffer): T;
}
