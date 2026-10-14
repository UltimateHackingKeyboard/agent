// yargs 18 ships no typings and @types/yargs (17.x) does not match the scripts' untyped argv usage.
declare module 'yargs' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export default function yargs(args?: string[]): any;
}

declare module 'yargs/helpers' {
    export function hideBin(argv: string[]): string[];
}
