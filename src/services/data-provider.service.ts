import { Injectable } from '@angular/core';

@Injectable()
export class DataProviderService {

    constructor() { }

    getBaseLayer(): any {
        return require('xml!../../images/base-layer.svg').svg;
    }

    getUHKConfig(): any {
        return require('json!../../config-serializer/uhk-config.json');
    }

}
