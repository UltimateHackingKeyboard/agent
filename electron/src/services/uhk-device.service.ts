import { Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Subscriber } from 'rxjs/Subscriber';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ILogService, LOG_SERVICE } from '../shared/services/logger.service';
import { SenderMessage } from '../models/sender-message';
import { Constants } from '../shared/util/constants';

enum Command {
    UploadConfig = 8,
    ApplyConfig = 9
}

export abstract class UhkDeviceService {
    protected connected$: BehaviorSubject<boolean>;
    protected initialized$: BehaviorSubject<boolean>;
    protected deviceOpened$: BehaviorSubject<boolean>;
    protected outSubscription: Subscription;

    protected messageIn$: Observable<Buffer>;
    protected messageOut$: Subject<SenderMessage>;

    constructor(@Inject(LOG_SERVICE) protected logService: ILogService) {
        this.messageOut$ = new Subject<SenderMessage>();
        this.initialized$ = new BehaviorSubject(false);
        this.connected$ = new BehaviorSubject(false);
        this.deviceOpened$ = new BehaviorSubject(false);
        this.outSubscription = Subscription.EMPTY;
    }

    ngOnDestroy() {
        this.disconnect();
        this.initialized$.unsubscribe();
        this.connected$.unsubscribe();
        this.deviceOpened$.unsubscribe();
    }

    sendConfig(configBuffer: Buffer): Observable<Buffer> {
        return Observable.create((subscriber: Subscriber<Buffer>) => {
            this.logService.info('Sending...', configBuffer);
            const fragments: Buffer[] = [];
            const MAX_SENDING_PAYLOAD_SIZE = Constants.MAX_PAYLOAD_SIZE - 4;
            for (let offset = 0; offset < configBuffer.length; offset += MAX_SENDING_PAYLOAD_SIZE) {
                const length = offset + MAX_SENDING_PAYLOAD_SIZE < configBuffer.length
                    ? MAX_SENDING_PAYLOAD_SIZE
                    : configBuffer.length - offset;
                const header = new Buffer([Command.UploadConfig, length, offset & 0xFF, offset >> 8]);
                fragments.push(Buffer.concat([header, configBuffer.slice(offset, offset + length)]));
            }

            const buffers: Buffer[] = [];
            const observer: Observer<Buffer> = {
                next: (buffer: Buffer) => buffers.push(buffer),
                error: error => subscriber.error(error),
                complete: () => {
                    if (buffers.length === fragments.length) {
                        subscriber.next(Buffer.concat(buffers));
                        subscriber.complete();
                        this.logService.info('Sending finished');
                    }
                }
            };

            fragments
                .map<SenderMessage>(fragment => ({ buffer: fragment, observer }))
                .forEach(senderPackage => this.messageOut$.next(senderPackage));
        });
    }

    applyConfig(): Observable<Buffer> {
        return Observable.create((subscriber: Subscriber<Buffer>) => {
            this.logService.info('Applying configuration');
            this.messageOut$.next({
                buffer: new Buffer([Command.ApplyConfig]),
                observer: subscriber
            });
        });
    }

    isInitialized(): Observable<boolean> {
        return this.initialized$.asObservable();
    }

    isConnected(): Observable<boolean> {
        return this.connected$.asObservable();
    }

    isOpened(): Observable<boolean> {
        return this.deviceOpened$.asObservable();
    }

    disconnect() {
        this.outSubscription.unsubscribe();
        this.messageIn$ = undefined;
        this.initialized$.next(false);
        this.deviceOpened$.next(false);
        this.connected$.next(false);
    }

    abstract initialize(): void;

    abstract hasPermissions(): Observable<boolean>;
}
