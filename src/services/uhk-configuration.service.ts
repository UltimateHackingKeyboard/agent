import { Injectable } from '@angular/core';
import {DataProviderService} from './data-provider.service';

import {UhkConfiguration} from '../../config-serializer/config-items/UhkConfiguration';

@Injectable()
export class UhkConfigurationService {

    private configuration: UhkConfiguration;

    constructor(private dataProviderService: DataProviderService) {
        this.configuration = new UhkConfiguration().fromJsObject(this.dataProviderService.getUHKConfig());
    }

    getUhkConfiguration(): UhkConfiguration {
        return this.configuration;
    }

}
