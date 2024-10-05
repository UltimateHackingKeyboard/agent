import { Pipe, PipeTransform } from '@angular/core';
import { HostConnections, HOST_CONNECTION_LABELS } from 'uhk-common';

@Pipe({
    name: 'hostConnectionTypeLabelPipe',
})
export class HostConnectionTypeLabelPipePipe implements PipeTransform {

    transform(hostConnection: HostConnections): string {
        return HOST_CONNECTION_LABELS[hostConnection];
    }
}
