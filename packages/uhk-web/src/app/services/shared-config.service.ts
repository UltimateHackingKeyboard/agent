import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';

import { SharedConfigApplyData } from 'uhk-common';

/**
 * Platform specific shared configuration file synchronization.
 *
 * The default implementation is a no-op. The Electron implementation
 * (see ElectronSharedConfigService) writes to the shared file, watches it for
 * external changes, and emits them on changeDetected$.
 */
@Injectable()
export class SharedConfigService {
    readonly changeDetected$: Observable<SharedConfigApplyData> = NEVER;

    configure(_filePath: string | undefined, _detectChanges: boolean): Promise<void> {
        return Promise.resolve();
    }

    write(_data: Uint8Array): Promise<void> {
        return Promise.resolve();
    }

    acknowledge(_content?: string): Promise<void> {
        return Promise.resolve();
    }
}
