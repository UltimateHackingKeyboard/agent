import { ClassArray } from '../ClassArray';
import { UhkBuffer } from '../UhkBuffer';
import { Module } from './Module';

export class Modules extends ClassArray<Module> {

    constructor(modules?: Modules) {
        super();
        if (!modules) {
            return;
        }
        modules.elements.forEach(module => this.elements.push(new Module(module)));
    }

    jsObjectToClass(jsObject: any): Module {
        return new Module().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Module {
        return new Module().fromBinary(buffer);
    }

}
