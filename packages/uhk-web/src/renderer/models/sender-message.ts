import { Observer } from 'rxjs/Observer';

export interface SenderMessage {
    buffer: Buffer;
    observer: Observer<any>;
}
