export class LogService {
    error(...args: any[]): void {
        console.error(args);
    }

    debug(...args: any[]): void {
        console.log(args);
    }

    silly(...args: any[]): void {
        console.log(args);
    }

    info(...args: any[]): void {
        console.info(args);
    }
}
