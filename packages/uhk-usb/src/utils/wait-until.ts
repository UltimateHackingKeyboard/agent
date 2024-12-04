import {snooze} from './snooze.js';

export interface WaitUntilOptions {
    /**
     * If returns with true then start new iteration
     */
    shouldWait: () => Promise<boolean>;
    /**
     * maximum wait timeout in millisecond
     */
    timeout?: number;
    /**
     * maximum wait timeout in millisecond
     */
    timeoutErrorMessage?: string;
    /**
     * waits between 2 iteration in milliseconds
     */
    wait: number;
}

export async function waitUntil({ shouldWait, timeout = Number.MAX_SAFE_INTEGER, timeoutErrorMessage, wait }: WaitUntilOptions): Promise<void> {
    const startTime = new Date();

    while (new Date().getTime() - startTime.getTime() < timeout) {
        const shouldRun = await shouldWait();
        if (!shouldRun) {
            return;
        }

        if (wait) {
            await snooze(wait);
        }
    }

    throw Error(timeoutErrorMessage || 'Wait until timed out.');
}
