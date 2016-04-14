import { Injectable } from 'angular2/core';

@Injectable()
export class DataProviderService {

    constructor() { }

    getBaseLayer(): any {
        return require('xml!../../images/base-layer.svg').svg;
    }

}
