export const snooze = (ms: number) : Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
