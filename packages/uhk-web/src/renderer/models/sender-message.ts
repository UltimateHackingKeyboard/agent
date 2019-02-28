import { Observer } from 'rxjs';

export interface SenderMessage {
    buffer: Buffer;
    observer: Observer<any>;
}
