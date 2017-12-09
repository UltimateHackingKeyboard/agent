import { QueueEntry } from '../models/queue-entry';

export class QueueManager {
    private _queue: QueueEntry[] = [];
    private _processing = false;

    async add(entry: QueueEntry): Promise<void> {
        this._queue.push(entry);
        this.process();
    }

    private async process(): Promise<void> {
        if (this._processing) {
            return;
        }

        this._processing = true;

        while (this._queue.length !== 0) {
            const entry = this._queue.splice(0, 1)[0];
            if (entry.asynchronous) {
                await entry.method.apply(entry.bind, entry.params);
            } else {
                entry.method.apply(entry.bind, entry.params);
            }
        }

        this._processing = false;
    }
}
