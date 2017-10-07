export namespace LogRegExps {
    export const transferRegExp = /USB\[T]:/;
    export const writeRegExp = /USB\[W]:/;
    export const readRegExp = /USB\[R]: 00/;
    export const errorRegExp = /(?:(USB\[R]: ([^0]|0[^0])))/;
}
