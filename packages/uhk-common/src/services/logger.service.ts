export class LogService {
    error(...args: any[]): void {
        console.error(args);
    }

    debug(...args: any[]): void {
        console.debug(args);
    }

    silly(...args: any[]): void {
        console.debug(args);
    }

    info(...args: any[]): void {
        console.info(args);
    }
}
