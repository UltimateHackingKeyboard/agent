import { NON_ASCII_REGEXP } from "./constants";

export function hasNonAsciiCharacters(text: string): boolean {
    if (!text)
        return false;

    return new RegExp(NON_ASCII_REGEXP).test(text);
}
